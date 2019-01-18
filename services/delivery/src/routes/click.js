const { asyncRoute, getAdUnit } = require('../utils');
const deliver = require('../deliver');

module.exports = (app) => {
  app.get('/click/:adunitid', asyncRoute(async ({ params, query }, res) => {
    const { adunitid } = params;
    const adunit = await getAdUnit(adunitid);

    const winner = await deliver(adunit, 'click', query);
    if (!winner) return res.status(204).send();

    return res.redirect(302, winner.url);
  }));
};
