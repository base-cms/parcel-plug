const { Schema } = require('mongoose');

const schema = new Schema({
  adunitId: Schema.Types.ObjectId,
  start: Date,
  end: Date,
  lineitemId: Schema.Types.ObjectId,
  priority: Number,
  ads: [{
    _id: Schema.Types.ObjectId,
    src: String,
    url: String,
  }],
});

schema.index({ adunitId: 1, start: 1, end: 1 });
schema.index({ lineitemId: 1 });
schema.index({ priority: 1 });

module.exports = schema;
