const mongoose = require('./mongoose/connections');
const models = require('./mongoose/models');
const Account = require('./mongoose/models/account');
const { log } = require('./output');
const { NODE_ENV, ACCOUNT_KEY } = require('./env');
const redis = require('./redis');
const s3 = require('./s3/ping');

const start = (promise, name, url) => {
  log(`> Connecting to ${name}...`);
  return promise.then((r) => {
    const u = typeof url === 'function' ? url(r) : url;
    log(`> ${name} connected ${u ? `(${u})` : ''}`);
    return r;
  });
};

const createAccount = async () => new Promise((resolve, reject) => {
  if (NODE_ENV !== 'development') {
    resolve();
  } else {
    mongoose.core.once('open', () => {
      Account.findOneAndUpdate({ key: ACCOUNT_KEY }, {
        $setOnInsert: { key: ACCOUNT_KEY, name: 'Development Account' },
      }, {
        upsert: true,
        setDefaultsOnInsert: true,
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          log(`> Successfully created account '${ACCOUNT_KEY}'`);
          resolve();
        }
      });
    });
  }
});

const indexModel = Model => new Promise((resolve, reject) => {
  Model.on('index', (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

const indexModels = () => Promise.all(Object.keys(models).map(name => indexModel(models[name])));

module.exports = () => Promise.all([
  start(mongoose.core, 'MongoDB core', m => m.client.s.url),
  start(mongoose.account, 'MongoDB account', m => m.client.s.url),
  createAccount(),
  indexModels().then(() => log('> Model indexes created.')),
  start(new Promise((resolve, reject) => {
    redis.on('connect', resolve);
    redis.on('error', reject);
  }), 'Redis', () => redis.options.url),
  start(s3(), 'S3'),
]);
