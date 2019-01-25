const { Schema } = require('mongoose');

const schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['click', 'view', 'request'],
  },
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
  correlator: String,
});

schema.index({ type: 1 });
schema.index({ deploymentId: 1 });
schema.index({ adunitId: 1 });
schema.index({ orderId: 1, type: 1 });
schema.index({ lineitemId: 1, type: 1 });
schema.index({ adId: 1, type: 1, correlator: 1 });

module.exports = schema;
