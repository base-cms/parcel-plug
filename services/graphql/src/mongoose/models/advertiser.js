const connection = require('../connections/account');
const schema = require('../schema/advertiser');

module.exports = connection.model('advertiser', schema);
