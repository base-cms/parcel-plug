const connection = require('../connections/account');
const schema = require('../schema/deployment');

module.exports = connection.model('deployment', schema);
