const db = require('../db');
const { log, randomElement } = require('../utils');

const getSchedules = (adunitId, date) => db.aggregate('schedules', [
  { $match: { adunitId, start: { $lte: date }, end: { $gte: date } } },
  { $project: { _id: 1, priority: 1 } },
  { $group: { _id: '$priority', ids: { $push: '$_id' } } },
  { $sort: { _id: -1 } },
]);

/**
 * Updates the correlator entry
 *
 * @param {*} correlator
 * @param {*} adUnit
 * @param {*} schedule
 * @param {*} ad
 */
const updateCorrelator = async (correlator, ad, lineitemId) => {
  const { _id: adId, src, url } = ad;
  // const { deploymentId, publisherId } = adunit;
  // const { lineitemId } = schedule;
  return db.updateOne('correlators', { value: correlator }, {
    $set: {
      src,
      url,
      adId,
      lineitemId,
    },
  }, { upsert: true });

  // const [, lineitem] = await Promise.all([
  //   db.updateOne('correlators', { value: correlator }, {
  //     $setOnInsert: {
  //       src,
  //       url,
  //       adId: ad._id,
  //       date: new Date(),
  //     },
  //   }, { upsert: true }),
  //   db.findById('lineitems', lineitemId, {
  //     projection: { orderId: 1, advertiserId: 1 },
  //   }),
  // ]);

  // const { orderId, advertiserId } = lineitem;
  // const eventSet = {
  //   adunitId: adunit._id,
  //   adId: ad._id,
  //   lineitemId,
  //   orderId,
  //   advertiserId,
  //   deploymentId,
  //   publisherId,
  // };
  // db.updateMany('events', { correlator }, { $set: eventSet }, { upsert: true });
};


/**
 * Retrieves an ad for the request.
 *
 * @param {string} correlator The correlator hash value.
 * @param {object} adunit The ad unit database document.
 * @param {Date} date The request/correlator date.
 */
module.exports = async (correlator, adunit, date) => {
  const correlated = await db.findOne('correlators', { value: correlator });
  if (correlated) return correlated;

  const cursor = await getSchedules(adunit._id, date);
  const schedules = await cursor.toArray();
  log({ schedules });
  if (!schedules.length) return null;

  const scheduleId = randomElement(schedules[0].ids);
  const schedule = await db.findById('schedules', scheduleId, {
    projection: { ads: 1, lineitemId: 1 },
  });
  log({ schedule });
  if (!schedule) return null;

  const { ads, lineitemId } = schedule;
  const ad = randomElement(ads);
  const { src, url, _id: adId } = ad;
  updateCorrelator(correlator, ad, lineitemId).catch(() => {
    // @todo log error
  });
  // Return a consistent value.
  return {
    src,
    url,
    adId,
    lineitemId,
  };
};
