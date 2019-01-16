const { Schema } = require('mongoose');

const schema = new Schema({
  correlator: String,
  type: String,
  count: Number,
  adId: Schema.Types.ObjectId,
  adUnitId: Schema.Types.ObjectId,
  advertiserId: Schema.Types.ObjectId,
  deploymentId: Schema.Types.ObjectId,
  lineItemId: Schema.Types.ObjectId,
  orderId: Schema.Types.ObjectId,
  publisherId: Schema.Types.ObjectId,
});

schema.index({ correlator: 1, type: 1, count: 1 });

module.exports = schema;
