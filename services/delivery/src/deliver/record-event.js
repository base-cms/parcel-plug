const { mongo } = require('../connections');

module.exports = (correlator, type = 'request') => mongo.db().collection('events').updateOne({ correlator, type }, { $inc: { count: 1 } }, { upsert: true });
