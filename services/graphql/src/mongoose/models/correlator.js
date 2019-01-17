const connection = require('../connections/account');
const schema = require('../schema/correlator');

module.exports = connection.model('correlator', schema);
