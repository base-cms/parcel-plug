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
  async view(adunit, adId, { now, email, send }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;
    const ids = await getAdIds(adId);
    return db.insertOne('views', {
      ...ids,
      adunitId,
      deploymentId,
      publisherId,
      date: now,
      email,
      send,
    });
  },

  async click(adunit, adId, { now, email, send }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;
    const ids = await getAdIds(adId);
    return db.insertOne('clicks', {
      ...ids,
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
    return db.insertOne('requests', {
      adunitId,
      deploymentId,
      publisherId,
      date: now,
      email,
      send,
    });
  },
};
