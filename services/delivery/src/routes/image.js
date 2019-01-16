const { asyncRoute, deliver, getAdUnit } = require('../utils');

module.exports = (app) => {
  app.get('/image/:id', asyncRoute(async ({ params, query }, res) => {
    const adunit = await getAdUnit(params.id);
    if (!adunit) return res.status(404).send('Invalid Ad Unit');

    const winner = await deliver(adunit, 'view', query);
    if (!winner) return res.status(204).send();

    return res.redirect(winner.src);
  }));
};
