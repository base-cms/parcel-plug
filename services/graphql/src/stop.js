const mongoose = require('./mongoose/connections');
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
]);
