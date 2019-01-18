const { Schema } = require('mongoose');

const schema = new Schema({
  adunitId: Schema.Types.ObjectId,
  deploymentId: Schema.Types.ObjectId,
  publisherId: Schema.Types.ObjectId,
  date: Date,
  email: String,
  send: String,
});

module.exports = schema;
