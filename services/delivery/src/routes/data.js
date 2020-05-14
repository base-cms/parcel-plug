const { asyncRoute, getAdUnit } = require('../utils');
const deliver = require('../deliver');
const db = require('../db');

module.exports = (app) => {
  app.get('/data/:adunitid', asyncRoute(async (req, res) => {
    const { params, query } = req;
    const { adunitid } = params;
    const adunit = await getAdUnit(adunitid);

    const correlated = await deliver(adunit, query, 'data', req);
    if (!correlated) return res.status(204).send();

    const [deployment, ad] = await Promise.all([
      db.findById('deployments', adunit.deploymentId),
      db.findById('ads', correlated.adId),
    ]);

    return res.json({
      deployment,
      ad,
      correlated,
    });
  }));
};
