const { HealthCheckError } = require('@godaddy/terminus');
const mongodb = require('./mongodb');
const { log } = require('./utils');
const pkg = require('../package.json');

const ping = (promise, name) => promise.then(() => `${name} pinged successfully.`);

const mongo = () => {
  const args = [{ _id: pkg.name }, { $set: { last: new Date() } }, { upsert: true }];
  return Promise.all([
    mongodb.db().command({ ping: 1 }),
    mongodb.db().collection('pings').updateOne(...args),
  ]);
};

module.exports = () => {
  const errors = [];
  return Promise.all([
    ping(mongo(), 'MongoDB'),
  ].map(p => p.catch((err) => {
    errors.push(err);
  }))).then((res) => {
    if (errors.length) {
      log(errors);
      throw new HealthCheckError('Unhealthy', errors.map(e => e.message));
    }
    return res;
  });
};
