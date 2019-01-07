const connection = require('../connections/account');
const schema = require('../schema/user');

module.exports = connection.model('user', schema);
