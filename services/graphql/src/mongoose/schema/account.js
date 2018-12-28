const { Schema } = require('mongoose');
const slug = require('slug');
const pushId = require('unique-push-id');

const sessionSchema = new Schema({
  globalSecret: {
    type: String,
    required: true,
    default: () => pushId(),
  },
  namespace: {
    type: String,
    required: true,
    default: () => pushId(),
  },
  expiration: {
    type: Number,
    required: true,
    default: 86400,
    min: 10,
    max: 31536000,
  },
});

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  key: {
    type: String,
    maxlength: 54,
    lowercase: true,
    unique: true,
    set: v => slug(v),
  },
  session: {
    type: sessionSchema,
    required: true,
    default: () => ({}),
  },
}, { timestamps: true });

module.exports = schema;
