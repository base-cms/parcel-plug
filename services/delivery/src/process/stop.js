const { mongo, redis } = require('../connections');
const { log } = require('../utils');

const stop = (promise, name) => {
  log(`> Disconnecting from ${name}...`);
  return promise.then((r) => {
    log(`> ${name} disconnected`);
    return r;
  });
};

module.exports = () => Promise.all([
  stop(mongo.close(), 'MongoDB'),
  stop(new Promise((resolve, reject) => {
    redis.on('end', resolve);
    redis.on('error', reject);
    redis.quit();
  }), 'Redis'),
]);
