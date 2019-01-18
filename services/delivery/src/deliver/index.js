const normalizeQuery = require('../utils/normalize-query');
const createCorrelator = require('../utils/create-correlator');
const getAd = require('./get-ad');
const { log } = require('../utils');

module.exports = async (adunit, query) => {
  const { _id: adunitid, width, height } = adunit;
  const {
    date,
    email,
    rand,
    // send,
    placeholder,
  } = normalizeQuery(query);

  if (placeholder) {
    return {
      src: `https://placehold.it/${width}x${height}`,
      url: 'https://email-x.io',
    };
  }

  const correlator = createCorrelator({
    adunitid,
    date,
    email,
    rand,
  });
  log({ correlator });
  const correlated = await getAd(correlator, adunit, date);
  log({ correlated });
  return correlated;
};
