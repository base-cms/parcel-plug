const pushId = require('unique-push-id');
const slug = require('slug');
const uuid = require('uuid/v4');
const { Schema } = require('mongoose');

const sessionSchema = new Schema({
  globalSecret: {
    type: String,
    required: true,
    default: () => `${pushId()}.${uuid()}`,
  },
  namespace: {
    type: String,
    required: true,
    default: () => uuid(),
  },
  expiration: {
    type: Number,
    required: true,
    default: 86400,
    min: 10,
    max: 31536000,
  },
});

const settingsSchema = new Schema({
  session: {
    type: sessionSchema,
    required: true,
    default: () => ({}),
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
  settings: {
    type: settingsSchema,
    required: true,
    default: () => ({}),
  },
}, { timestamps: true });

module.exports = schema;
