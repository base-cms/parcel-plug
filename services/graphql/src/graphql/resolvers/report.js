const Event = require('../../mongoose/models/event');
const {
  advertiser,
  order,
  lineitem,
  ad,
  publisher,
  deployment,
  adunit,
} = require('../../mongoose/models');

const { isArray } = Array;

const aggregate = async ({ criteria, start, end }) => {
  const date = { $gte: start, $lte: end };
  const pipeline = [
    {
      $match: { ...criteria, date },
    },
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
        _id: false,
      },
    },
  ];
  const rows = await Event.aggregate(pipeline);
  return { rows: rows || [] };
};

module.exports = {
  /**
   *
   */
  ReportRow: {
    advertiser: ({ advertiserId }) => advertiser.findById(advertiserId),
    order: ({ orderId }) => order.findById(orderId),
    lineitem: ({ lineitemId }) => lineitem.findById(lineitemId),
    ad: ({ adId }) => ad.findById(adId),
    publisher: ({ publisherId }) => publisher.findById(publisherId),
    deployment: ({ deploymentId }) => deployment.findById(deploymentId),
    adunit: ({ adunitId }) => adunit.findById(adunitId),
    ctr: ({ impressions, clicks }) => clicks / impressions,
  },

  /**
   *
   */
  Query: {
    report: (_, { input }) => {
      const { start, end } = input;
      const map = [
        { key: 'adId', field: 'adIds' },
        { key: 'adunitId', field: 'adunitIds' },
        { key: 'advertiserId', field: 'advertiserIds' },
        { key: 'deploymentId', field: 'deploymentIds' },
        { key: 'lineitemId', field: 'lineitemIds' },
        { key: 'orderId', field: 'orderIds' },
        { key: 'publisherId', field: 'publisherIds' },
      ];
      const criteria = map.reduce((o, { key, field }) => {
        const value = input[field];
        if (!isArray(value) || !value.length) return o;
        return { ...o, [key]: { $in: value } };
      }, { type: { $in: ['click', 'view'] } });

      return aggregate({ criteria, start, end });
    },
  },
};
