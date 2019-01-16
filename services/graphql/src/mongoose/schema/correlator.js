const { Schema } = require('mongoose');

const schema = new Schema({
  correlator: String,
  src: String,
  url: String,
  adId: Schema.Types.ObjectId,
});

schema.index({ correlator: 1 });

module.exports = schema;
