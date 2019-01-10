const connection = require('../connections/account');
const schema = require('../schema/adunit');

module.exports = connection.model('adunit', schema);
