const moment = require('moment');
const recordEvent = require('./record-event');
const getAd = require('./get-ad');
const { log } = require('../utils');

module.exports = async (adUnit, type, query) => {
  // @todo throw 400 error if date, rand, or email are missing.
  const adUnitId = adUnit._id;
  const { width, height } = adUnit;
  const { date: dateStr, email, rand } = query;

  const date = moment(dateStr).toDate();

  if (query.placeholder) {
    return {
      src: `https://placehold.it/${width}x${height}`,
      url: 'https://email-x.io',
    };
  }

  const correlate = {
    adUnitId: `${adUnitId}`,
    date: date.valueOf(),
    email,
    rand,
  };
  const correlator = Buffer.from(JSON.stringify(correlate)).toString('base64');

  // write the request event
  if (type === 'view') recordEvent(correlator);
  // write the click/view event
  recordEvent(correlator, type);

  const ad = await getAd(correlator, adUnit, date);
  log({ ad });
  return ad;
};
