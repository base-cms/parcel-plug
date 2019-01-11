const connection = require('../connections/account');
const schema = require('../schema/lineitem');

module.exports = connection.model('lineitem', schema);
