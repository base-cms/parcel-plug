const connection = require('../connections/account');
const schema = require('../schema/publisher');

module.exports = connection.model('publisher', schema);
