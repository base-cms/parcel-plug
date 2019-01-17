const moment = require('moment');
const { mongo } = require('../connections');
const { log, randomElement } = require('../utils');

const getSchedules = (adUnitId, date) => {
  const pipeline = [
    { $match: { adUnitId, start: { $gte: date }, end: { $lte: date } } },
    { $project: { _id: 1, priority: 1 } },
    { $group: { _id: '$priority', ids: { $push: '$_id' } } },
    { $sort: { _id: -1 } },
  ];
  return mongo.db().collection('schedules').aggregate(pipeline);
};

/**
 * Updates the correlator entry
 *
 * @param {*} correlator
 * @param {*} adUnit
 * @param {*} schedule
 * @param {*} ad
 */
const updateCorrelator = async (correlator, adUnit, schedule, ad) => {
  const { src, url } = ad;
  const adId = ad._id;
  const adUnitId = adUnit._id;
  mongo.db().collection('correlators').updateOne({ correlator }, { $set: { src, url, adId } }, { upsert: true });

  const { deploymentId, publisherId } = adUnit;
  const { lineItemId } = schedule;
  const lineItemOpts = {
    projection: {
      orderId: 1,
      advertiserId: 1,
    },
  };
  const lineItem = await mongo.db().collection('lineitems').findOne({ _id: lineItemId }, lineItemOpts);
  const { orderId, advertiserId } = lineItem;
  const eventSet = {
    adUnitId,
    adId,
    lineItemId,
    orderId,
    advertiserId,
    deploymentId,
    publisherId,
  };
  mongo.db().collection('events').updateMany({ correlator }, { $set: eventSet }, { upsert: true, multi: true });
};


/**
 * Retrieves an ad for the request
 */
module.exports = async (correlator, adUnit, strdate) => {
  const date = moment(strdate).toDate(); // @todo moment
  const correlated = await mongo.db().collection('correlators').findOne({ correlator });
  if (correlated) return correlated;

  const schedules = await getSchedules(adUnit._id, date).toArray();
  log({ schedules });

  const scheduleId = randomElement(schedules);
  const schedule = await mongo.db().collection('schedules').findOne({ _id: scheduleId });
  if (!schedule) return null;

  const ad = randomElement(schedule.ads);
  updateCorrelator(correlator, adUnit, schedule, ad);
  return ad;
};
