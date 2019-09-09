const db = require('../db');
const { CLICK_FREQUENCY_NUMBER, CLICK_FREQUENCY_INTERVAL } = require('../env');

const { log } = console;

const filterByThreshold = (items) => {
  const values = items.reduce((arr, { _id, date }) => {
    const v = date.valueOf();
    return { ...arr, [v]: _id };
  }, {});
  const dates = Object.keys(values).map(n => parseInt(n, 10));
  dates.sort((a, b) => a - b);
  const badDates = [];
  let bad = [];
  let now = dates.shift();
  while (dates.length) {
    const n = dates.shift();
    if (n < now + CLICK_FREQUENCY_INTERVAL) {
      bad.push(n);
    } else {
      // Reset our frequency start to the current date
      now = n;
      // Push bad dates if we've met the frequency cap
      if (bad.length >= CLICK_FREQUENCY_NUMBER) bad.forEach(d => badDates.push(d));
      // Reset the bad date queue
      bad = [];
    }
  }
  if (bad.length >= CLICK_FREQUENCY_NUMBER) bad.forEach(d => badDates.push(d));

  return [...new Set([...badDates])].map(v => values[v]);
};

/**
 * This rule marks clicks as fraudlent if a significant number of clicks are recorded
 * from the same IP address, within a set time period.
 *
 * It will query from the oldest record to the newest, and will only process records once.
 * If a record is considered fraudulent, all clicks (events?) from that IP will be invalidated.
 */
module.exports = async () => {
  log('click-frequency: Starting');
  const coll = db.collection('events');

  const pipeline = [
    { $match: { type: 'click', ip: { $exists: true } } },
    { $sort: { date: -1 } },
    {
      $group: {
        _id: '$ip',
        clicks: { $addToSet: { _id: '$_id', date: '$date' } },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: 1 } },
  ];

  const events = await coll.aggregate(pipeline);

  // eslint-disable-next-line no-await-in-loop
  while (await events.hasNext()) {
    // eslint-disable-next-line no-await-in-loop
    const event = await events.next();
    const { _id: ip, clicks } = event;

    log(`click-frequency: Checking ip ${ip}...`);
    const flagged = filterByThreshold(clicks);
    log(`click-frequency: Found ${flagged.length} to flag for ${ip}`);

    if (flagged.length) {
      const bulkOps = flagged.map(_id => ({
        updateOne: {
          filter: { _id },
          update: { $set: { flagged: true, flagReason: 'click-frequency' } },
        },
      }));
      // eslint-disable-next-line no-await-in-loop
      const { matchedCount } = await coll.bulkWrite(bulkOps);
      log(`click-frequency: Updated ${matchedCount} flagged events.`);
    }
  }
  log('click-frequency: Done');
};
