const connection = require('../connections/account');
const schema = require('../schema/order');

module.exports = connection.model('order', schema);
