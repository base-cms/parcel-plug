const { Schema } = require('mongoose');
const connection = require('../connections/account');
const { referencePlugin } = require('../plugins');

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

schema.plugin(referencePlugin, {
  name: 'publisherId',
  connection,
  modelName: 'publisher',
  options: { required: true },
});

module.exports = schema;
