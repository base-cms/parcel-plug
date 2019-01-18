const { asyncRoute, getAdUnit } = require('../utils');
const deliver = require('../deliver');

module.exports = (app) => {
  app.get('/image/:id', asyncRoute(async ({ params, query }, res) => {
    const adunit = await getAdUnit(params.id);

    const winner = await deliver(adunit, 'view', query);
    if (!winner) return res.status(200).send();

    return res.redirect(302, winner.src);
  }));
};
