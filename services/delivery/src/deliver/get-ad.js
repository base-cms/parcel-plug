const db = require('../db');
const { randomElement } = require('../utils');
const logError = require('../log-error');

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
  return db.updateOne('correlators', { value: correlator }, {
    $set: {
      src,
      url,
      adId,
      lineitemId,
    },
  }, { upsert: true });
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
  if (!schedules.length) return null;

  const scheduleId = randomElement(schedules[0].ids);
  const schedule = await db.findById('schedules', scheduleId, {
    projection: { ads: 1, lineitemId: 1 },
  });
  if (!schedule) return null;

  const { ads, lineitemId } = schedule;
  const ad = randomElement(ads);
  const { src, url, _id: adId } = ad;
  updateCorrelator(correlator, ad, lineitemId).catch(e => logError(e));
  return {
    src,
    url,
    adId,
    lineitemId,
  };
};
