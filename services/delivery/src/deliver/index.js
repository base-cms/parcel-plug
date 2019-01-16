const recordEvent = require('./record-event');
const getAd = require('./get-ad');
const { log } = require('../utils');

module.exports = async (adUnit, type, query) => {
  const adUnitId = adUnit._id;
  const { width, height } = adUnit;
  const { date, email, rand } = query;
  if (query.placeholder) {
    return {
      src: `https://placehold.it/${width}x${height}`,
      url: 'https://email-x.io',
    };
  }

  const correlate = {
    adUnitId,
    date,
    email,
    rand,
  };
  const correlator = Buffer.from(JSON.stringify(correlate)).toString('base64');

  // write the request event
  recordEvent(correlator);
  // write the click/view event
  recordEvent(correlator, type);

  const ad = await getAd(correlator, adUnit, date);
  log({ ad });
  return ad;
};
