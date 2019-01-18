const { ObjectId } = require('mongodb');
const mongodb = require('../mongodb');

const projection = { width: 1, height: 1 };
const criteria = id => ({ _id: new ObjectId(id), deleted: false });

module.exports = async id => mongodb.db().collection('adunits').findOne(criteria(id), { projection });
