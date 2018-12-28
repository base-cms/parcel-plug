const connection = require('../connections/core');
const schema = require('../schema/account');

module.exports = connection.model('account', schema);
