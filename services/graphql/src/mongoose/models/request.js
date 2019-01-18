const connection = require('../connections/account');
const schema = require('../schema/request');

module.exports = connection.model('request', schema);
