const { ObjectId } = require('mongodb');
const { mongo } = require('../connections');

const projection = { width: 1, height: 1 };
const criteria = id => ({ _id: new ObjectId(id), deleted: false });

module.exports = async id => mongo.db().collection('adunits').findOne(criteria(id), { projection });
