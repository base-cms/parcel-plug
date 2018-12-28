
const mongoose = require('./mongoose/connections');
const { log } = require('./output');

const start = (promise, name, url) => {
  log(`> Connecting to ${name}...`);
  return promise.then((r) => {
    const u = typeof url === 'function' ? url(r) : url;
    log(`> ${name} connected ${u ? `(${u})` : ''}`);
    return r;
  });
};

module.exports = () => Promise.all([
  start(mongoose.core, 'MongoDB core', m => m.client.s.url),
  start(mongoose.account, 'MongoDB account', m => m.client.s.url),
]);
