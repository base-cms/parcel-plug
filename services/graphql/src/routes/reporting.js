const { Parser } = require('json2csv');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const reportingService = require('../services/reporting');
const connection = require('../mongoose/connections/account');

const { isArray } = Array;

const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const retrieve = (type, $in, projection = ['name']) => connection.model(type).find({ _id: { $in } }, projection);

/**
 *
 * @param {*} field  The field to retrieve
 * @param {*} type   The model type (publisher, ad, etc)
 * @param {*} row    The record containing the `type`Id field
 * @param {*} models An array of models
 */
const getModelValue = (field, type, row, models) => {
  const found = models.filter(({ _id }) => `${_id}` === `${row[`${type}Id`]}`);
  return found[0][field] || null;
};

/**
 *
 */
const retrieveModels = async (rows) => {
  const [
    publisher,
    deployment,
    adunit,
    advertiser,
    order,
    lineitem,
    ad,
  ] = await Promise.all([
    retrieve('publisher', rows.map(({ publisherId }) => publisherId)),
    retrieve('deployment', rows.map(({ deploymentId }) => deploymentId)),
    retrieve('adunit', rows.map(({ adunitId }) => adunitId), ['name', 'size']),
    retrieve('advertiser', rows.map(({ advertiserId }) => advertiserId)),
    retrieve('order', rows.map(({ orderId }) => orderId)),
    retrieve('lineitem', rows.map(({ lineitemId }) => lineitemId)),
    retrieve('ad', rows.map(({ adId }) => adId), ['name', 'size']),
  ]);
  return {
    publisher,
    deployment,
    adunit,
    advertiser,
    order,
    lineitem,
    ad,
  };
};

const parseRefs = async (rows, fields) => {
  const models = await retrieveModels(rows);

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
  app.get('/reporting', asyncRoute(async (req, res) => {
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
    const date = moment().format();

    res.setHeader('Content-disposition', `attachment; filename=emailx_report_${date}.csv`);
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  }));
};
