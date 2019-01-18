const connection = require('../connections/account');
const schema = require('../schema/view');

module.exports = connection.model('view', schema);
