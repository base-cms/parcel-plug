const { Schema } = require('mongoose');

const schema = new Schema({
  adUnitId: Schema.Types.ObjectId,
  start: Date,
  end: Date,
  lineItemId: Schema.Types.ObjectId,
  priority: Number,
  ads: [{
    _id: Schema.Types.ObjectId,
    src: String,
    url: String,
  }],
});

schema.index({ adUnitId: 1, start: 1, end: 1 });
schema.index({ adUnitId: 1, lineItemId: 1 });

module.exports = schema;
