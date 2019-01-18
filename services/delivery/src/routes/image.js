const { asyncRoute, getAdUnit } = require('../utils');
const deliver = require('../deliver');

module.exports = (app) => {
  app.get('/image/:adunitid', asyncRoute(async ({ params, query }, res) => {
    const { adunitid } = params;
    const adunit = await getAdUnit(adunitid);

    const winner = await deliver(adunit, 'view', query);
    if (!winner) return res.status(200).send();

    return res.redirect(302, winner.src);
  }));
};
