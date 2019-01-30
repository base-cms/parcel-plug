const Event = require('../mongoose/models/event');

const { isArray } = Array;

const aggregate = async ($match) => {
  const pipeline = [
    { $match },
    {
      $group: {
        _id: {
          advertiserId: '$advertiserId',
          orderId: '$orderId',
          lineitemId: '$lineitemId',
          adId: '$adId',
          publisherId: '$publisherId',
          deploymentId: '$deploymentId',
          adunitId: '$adunitId',
        },
        clicks: { $sum: { $cond: [{ $eq: ['$type', 'click'] }, 1, 0] } },
        views: { $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] } },
      },
    },
    {
      $project: {
        advertiserId: '$_id.advertiserId',
        orderId: '$_id.orderId',
        lineitemId: '$_id.lineitemId',
        adId: '$_id.adId',
        publisherId: '$_id.publisherId',
        deploymentId: '$_id.deploymentId',
        adunitId: '$_id.adunitId',
        clicks: '$clicks',
        impressions: '$views',
        ctr: { $cond: [{ $eq: ['$views', 0] }, 0.00, { $divide: ['$clicks', '$views'] }] },
        _id: false,
      },
    },
  ];
  const rows = await Event.aggregate(pipeline);
  return { rows: rows || [] };
};

module.exports = (input) => {
  const { start, end } = input;
  const date = { $gte: start, $lte: end };
  const map = [
    { key: 'adId', field: 'adIds' },
    { key: 'adunitId', field: 'adunitIds' },
    { key: 'advertiserId', field: 'advertiserIds' },
    { key: 'deploymentId', field: 'deploymentIds' },
    { key: 'lineitemId', field: 'lineitemIds' },
    { key: 'orderId', field: 'orderIds' },
    { key: 'publisherId', field: 'publisherIds' },
  ];
  const $match = map.reduce((o, { key, field }) => {
    const value = input[field];
    if (!isArray(value) || !value.length) return o;
    return { ...o, [key]: { $in: value } };
  }, { date, type: { $in: ['click', 'view'] } });
  return aggregate($match);
};
