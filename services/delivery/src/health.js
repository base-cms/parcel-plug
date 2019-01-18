const { HealthCheckError } = require('@godaddy/terminus');
const db = require('./db');
const { log } = require('./utils');
const pkg = require('../package.json');

const ping = (promise, name) => promise.then(() => `${name} pinged successfully.`);

module.exports = () => {
  const errors = [];
  return Promise.all([
    ping(db.ping(pkg.name), 'MongoDB'),
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
