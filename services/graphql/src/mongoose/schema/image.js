const { Schema } = require('mongoose');

const schema = new Schema({
  filename: {
    type: String,
    trim: true,
    required: true,
  },
  src: {
    type: String,
    trim: true,
    required: true,
  },
  s3: {
    bucket: String,
    key: String,
    etag: String,
  },
  uploadedAt: {
    type: Date,
  },
  mimetype: {
    type: String,
  },
  size: {
    type: Number,
    min: 0,
  },
  width: {
    type: Number,
    min: 0,
  },
  height: {
    type: Number,
    min: 0,
  },
});

module.exports = schema;
