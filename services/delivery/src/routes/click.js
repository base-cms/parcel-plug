const { asyncRoute, getAdUnit } = require('../utils');
const deliver = require('../deliver');

module.exports = (app) => {
  app.get('/click/:adunitid', asyncRoute(async (req, res) => {
    const { params, query } = req;
    const { adunitid } = params;
    const adunit = await getAdUnit(adunitid);

    const correlated = await deliver(adunit, query, 'click', req);
    if (!correlated) return res.status(204).send();

    return res.redirect(302, correlated.url);
  }));
};
