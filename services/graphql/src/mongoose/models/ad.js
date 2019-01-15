const connection = require('../connections/account');
const schema = require('../schema/ad');

module.exports = connection.model('ad', schema);
