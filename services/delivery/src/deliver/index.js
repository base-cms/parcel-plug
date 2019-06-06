const normalizeQuery = require('../utils/normalize-query');
const createCorrelator = require('../utils/create-correlator');
const getAd = require('./get-ad');
const events = require('./events');
const logError = require('../log-error');

/**
 * @param {object} adunit The requested adunit document.
 * @param {object} query The request query string parameters.
 * @param {string} type The request type, e.g. `click` or `image`.
 * @param {object} req The Express request object
 */
module.exports = async (adunit, query, type, req) => {
  const { _id: adunitid } = adunit;
  const {
    date,
    email,
    rand,
    send,
  } = normalizeQuery(query);

  const correlator = createCorrelator({
    adunitid,
    date,
    email,
    rand,
  });
  const correlated = await getAd(correlator, adunit, date);

  // Record events, but do not await.
  const params = {
    now: new Date(),
    email,
    send,
    ip: req.ip,
    ua: req.get('user-agent'),
  };
  switch (type) {
    case 'image':
      events.request(adunit, params).catch(e => logError(e));
      if (correlated) {
        events.view(adunit, correlator, correlated.adId, params).catch(e => logError(e));
      }
      break;
    case 'click':
      if (correlated) {
        events.click(adunit, correlator, correlated.adId, params).catch(e => logError(e));
      }
      break;
    default:
      break;
  }
  return correlated;
};
