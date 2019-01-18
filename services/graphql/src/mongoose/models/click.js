const connection = require('../connections/account');
const schema = require('../schema/click');

module.exports = connection.model('click', schema);
