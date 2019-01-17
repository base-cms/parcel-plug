const { mongo } = require('../connections');
const { log, randomElement } = require('../utils');

const getSchedules = (adunitId, date) => {
  const pipeline = [
    { $match: { adunitId, start: { $lte: date }, end: { $gte: date } } },
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
  const adunitId = adUnit._id;
  mongo.db().collection('correlators').updateOne({ value: correlator }, { $set: { src, url, adId } }, { upsert: true });

  const { deploymentId, publisherId } = adUnit;
  const { lineitemId } = schedule;
  const lineItemOpts = {
    projection: {
      orderId: 1,
      advertiserId: 1,
    },
  };
  const lineItem = await mongo.db().collection('lineitems').findOne({ _id: lineitemId }, lineItemOpts);
  const { orderId, advertiserId } = lineItem;
  const eventSet = {
    adunitId,
    adId,
    lineitemId,
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
module.exports = async (correlator, adUnit, date) => {
  const correlated = await mongo.db().collection('correlators').findOne({ value: correlator });
  if (correlated) return correlated;

  const schedules = await getSchedules(adUnit._id, date).toArray();
  log({ schedules });
  if (!schedules.length) return null;

  const scheduleId = randomElement(schedules[0].ids);
  const schedule = await mongo.db().collection('schedules').findOne({ _id: scheduleId });
  if (!schedule) return null;

  const ad = randomElement(schedule.ads);
  updateCorrelator(correlator, adUnit, schedule, ad);
  return ad;
};
