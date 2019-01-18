const mongodb = require('../mongodb');

module.exports = (correlator, type = 'request') => mongodb.db().collection('events').updateOne({ correlator, type }, { $inc: { count: 1 } }, { upsert: true });
