const mongoose = require('mongoose');
const env = require('../../env');
const { name, version } = require('../../../package.json');

const { MONGO_DSN, ACCOUNT_KEY } = env;

const instanceDSN = MONGO_DSN.replace('/parcel-plug', `/parcel-plug-${ACCOUNT_KEY}`);

const connection = mongoose.createConnection(instanceDSN, {
  // autoIndex: env.NODE_ENV !== 'production',
  appname: `${name} v${version}`,
  bufferMaxEntries: 0, // Default -1
  ignoreUndefined: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
module.exports = connection;
