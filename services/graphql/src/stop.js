const mongoose = require('./mongoose/connections');
const redis = require('./redis');
const { log } = require('./output');

const stop = (promise, name) => {
  log(`> Disconnecting from ${name}...`);
  return promise.then((r) => {
    log(`> ${name} disconnected`);
    return r;
  });
};

module.exports = () => Promise.all([
  stop(mongoose.core.close(), 'MongoDB core'),
  stop(mongoose.account.close(), 'MongoDB account'),
  stop(new Promise((resolve, reject) => {
    redis.on('end', resolve);
    redis.on('error', reject);
    redis.quit();
  }), 'Redis'),
]);
