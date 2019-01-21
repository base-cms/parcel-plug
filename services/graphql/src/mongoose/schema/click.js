const { Schema } = require('mongoose');

const schema = new Schema({
  adId: Schema.Types.ObjectId,
  lineitemId: Schema.Types.ObjectId,
  orderId: Schema.Types.ObjectId,
  advertiserId: Schema.Types.ObjectId,
  adunitId: Schema.Types.ObjectId,
  deploymentId: Schema.Types.ObjectId,
  publisherId: Schema.Types.ObjectId,
  date: Date,
  email: String,
  send: String,
});

schema.index({ deploymentId: 1 });
schema.index({ adunitId: 1 });
schema.index({ orderId: 1 });
schema.index({ lineitemId: 1 });
schema.index({ adId: 1 });

module.exports = schema;
