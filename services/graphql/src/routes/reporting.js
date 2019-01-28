const { Parser } = require('json2csv');
const { ObjectId } = require('mongodb');
const reportingService = require('../services/reporting');
const logError = require('../log-error');
const {
  publisher, deployment, adunit, advertiser,
  order, lineitem, ad,
} = require('../mongoose/models');

const { isArray } = Array;

const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const retrieve = (model, $in, projection = ['name']) => model.find({ _id: { $in } }, projection);

/**
 *
 * @param {*} field  The field to retrieve
 * @param {*} type   The model type (publisher, ad, etc)
 * @param {*} row    The record containing the `type`Id field
 * @param {*} models An array of models
 */
const getModelValue = (field, type, row, models) => {
  try {
    const found = models.filter(({ _id }) => `${_id}` === `${row[`${type}Id`]}`);
    return found[0][field];
  } catch (e) {
    logError(e);
  }
  return null;
};

const parseRefs = async (rows, fields) => {
  /**
   * Ultimately this should get each distinct model, retrieve the unique
   * models using the fields for projection.  For now just hard loop it.
   *
   * @todo for large data sets this probably can't be done in memory.
   * Is there a way to send this through graph first?
   */
  const models = {
    publisher: await retrieve(publisher, rows.map(({ publisherId }) => publisherId)),
    deployment: await retrieve(deployment, rows.map(({ deploymentId }) => deploymentId)),
    adunit: await retrieve(adunit, rows.map(({ adunitId }) => adunitId), ['name', 'size']),
    advertiser: await retrieve(advertiser, rows.map(({ advertiserId }) => advertiserId)),
    order: await retrieve(order, rows.map(({ orderId }) => orderId)),
    lineitem: await retrieve(lineitem, rows.map(({ lineitemId }) => lineitemId)),
    ad: await retrieve(ad, rows.map(({ adId }) => adId), ['name', 'size']),
  };

  return rows.map((row) => {
    const out = { ...row };
    fields.forEach((field) => {
      if (field.indexOf('.') !== -1) {
        const [type, subfield] = field.split('.');
        out[field] = getModelValue(subfield, type, row, models[type]);
      }
    });
    return out;
  });
};

const formatInput = (queryParam) => {
  const input = JSON.parse(queryParam);
  input.start = new Date(input.start);
  input.end = new Date(input.end);
  ['publisherIds', 'deploymentIds', 'adunitIds', 'advertiserIds', 'orderIds', 'lineitemIds', 'adIds'].forEach((field) => {
    if (isArray(input[field]) && input[field].length) {
      input[field] = input[field].map(id => new ObjectId(id));
    }
  });
  return input;
};

module.exports = (app) => {
  app.get('/reporting.csv', asyncRoute(async (req, res) => {
    const input = formatInput(req.query.input);
    const fields = [
      'publisher.name',
      'deployment.name',
      'adunit.name',
      'adunit.size',
      'advertiser.name',
      'order.name',
      'lineitem.name',
      'ad.name',
      'ad.size',
      'impressions',
      'clicks',
      'ctr',
    ];
    const { rows } = await reportingService(input);
    const data = await parseRefs(rows, fields);

    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    const hash = Buffer.from(req.query.input, 'ascii').toString('base64');

    res.setHeader('Content-disposition', `attachment; filename=emailx_${hash}.csv`);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  }));
};
