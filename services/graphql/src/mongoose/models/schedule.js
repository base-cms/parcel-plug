const connection = require('../connections/account');
const schema = require('../schema/schedule');

module.exports = connection.model('schedule', schema);
