const { Schema } = require('mongoose');

const schema = new Schema({
  value: String,
  src: String,
  url: String,
  adId: Schema.Types.ObjectId,
});

schema.index({ value: 1 }, { unique: true });

module.exports = schema;
