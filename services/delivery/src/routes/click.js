const { asyncRoute, getAdUnit } = require('../utils');
const deliver = require('../deliver');

module.exports = (app) => {
  app.get('/click/:id', asyncRoute(async ({ params, query }, res) => {
    const adunit = await getAdUnit(params.id);
    if (!adunit) return res.status(404).send('Invalid Ad Unit');

    const winner = await deliver(adunit, 'click', query);
    if (!winner) return res.status(204).send();

    return res.redirect(302, winner.url);
  }));
};
