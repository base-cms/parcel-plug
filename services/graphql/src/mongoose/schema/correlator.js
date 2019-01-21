const { Schema } = require('mongoose');

const schema = new Schema({
  value: String,
  src: String,
  url: String,
  adId: Schema.Types.ObjectId,
  lineitemId: Schema.Types.ObjectId,
});

schema.index({ value: 1 }, { unique: true });
schema.index({ adId: 1 });
schema.index({ lineitemId: 1 });

module.exports = schema;
