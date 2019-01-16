const { HealthCheckError } = require('@godaddy/terminus');
const { mongo } = require('./connections');
const { log } = require('./utils');
const pkg = require('../package.json');

const ping = (promise, name) => promise.then(() => `${name} pinged successfully.`);

const mongodb = () => {
  const args = [{ _id: pkg.name }, { $set: { last: new Date() } }, { upsert: true }];
  return Promise.all([
    mongo.db().command({ ping: 1 }),
    mongo.db().collection('pings').updateOne(...args),
  ]);
};

module.exports = () => {
  const errors = [];
  return Promise.all([
    ping(mongodb(), 'MongoDB'),
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
