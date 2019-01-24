const db = require('../db');

const getAdIds = async (adId) => {
  const ad = await db.findById('ads', adId, { projection: { lineitemId: 1, advertiserId: 1 } });
  const lineitem = await db.findById('lineitems', ad.lineitemId, { projection: { orderId: 1 } });
  return {
    adId: ad._id,
    lineitemId: lineitem._id,
    orderId: lineitem.orderId,
    advertiserId: ad.advertiserId,
  };
};

module.exports = {
  async view(adunit, correlator, adId, { now, email, send }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;
    const ids = await getAdIds(adId);
    return db.insertOne('events', {
      ...ids,
      type: 'view',
      adunitId,
      deploymentId,
      publisherId,
      date: now,
      email,
      send,
      correlator,
    });
  },

  async click(adunit, correlator, adId, { now, email, send }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;

    const type = 'view';
    const view = await db.findOne('events', { type, adId, correlator }, { projection: { _id: 1 } });
    if (!view) await this.view(adunit, correlator, adId, { now, email, send });

    const ids = await getAdIds(adId);
    return db.insertOne('events', {
      ...ids,
      type: 'click',
      adunitId,
      deploymentId,
      publisherId,
      date: now,
      email,
      send,
    });
  },

  request(adunit, { now, email, send }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;
    return db.insertOne('events', {
      type: 'request',
      adunitId,
      deploymentId,
      publisherId,
      date: now,
      email,
      send,
    });
  },
};
