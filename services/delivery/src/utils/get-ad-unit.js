const { ObjectId } = require('mongodb');
const db = require('../db');

module.exports = async id => db.strictFindOne('adunits', {
  _id: new ObjectId(id),
  deleted: false,
}, {
  projection: { width: 1, height: 1 },
});
