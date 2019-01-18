const { MongoClient } = require('mongodb');
const { MONGO_DSN } = require('./env');

module.exports = new MongoClient(MONGO_DSN, { useNewUrlParser: true });
