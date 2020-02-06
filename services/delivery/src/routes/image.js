const { URL } = require('url');
const { asyncRoute, getAdUnit, cdnHostnameFor } = require('../utils');
const deliver = require('../deliver');

module.exports = (app) => {
  app.get('/image/:adunitid', asyncRoute(async (req, res) => {
    const { params, query } = req;
    const { adunitid } = params;
    const adunit = await getAdUnit(adunitid);

    const correlated = await deliver(adunit, query, 'image', req);
    if (!correlated) return res.status(204).send();

    const cdnHostname = await cdnHostnameFor(adunit.publisherId);

    const { src } = correlated;
    if (cdnHostname) {
      // A custom CDN host has been configured. Adjust the redirect.
      const url = new URL(src);
      url.hostname = cdnHostname;
      return res.redirect(302, `${url}`);
    }
    return res.redirect(302, src);
  }));
};
