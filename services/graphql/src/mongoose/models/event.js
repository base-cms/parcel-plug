const connection = require('../connections/account');
const schema = require('../schema/event');

module.exports = connection.model('event', schema);
