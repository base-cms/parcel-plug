const mongoose = require('mongoose');
const env = require('../../env');
const { name, version } = require('../../../package.json');

const { MONGO_DSN } = env;

const connection = mongoose.createConnection(MONGO_DSN, {
  // autoIndex: env.NODE_ENV !== 'production',
  appname: `${name} v${version}`,
  bufferMaxEntries: 0, // Default -1
  ignoreUndefined: true,
});

module.exports = connection;
