const { Schema } = require('mongoose');
const connection = require('../connections/account');
const {
  deleteablePlugin,
  paginablePlugin,
  referencePlugin,
  repositoryPlugin,
  userAttributionPlugin,
} = require('../plugins');

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
}, { timestamps: true });

schema.plugin(referencePlugin, {
  name: 'deploymentId',
  connection,
  modelName: 'deployment',
  options: { required: true },
});

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name'],
});
schema.plugin(userAttributionPlugin);

schema.pre('save', function setSize() {
  const { width, height } = this;
  this.size = `${width}x${height}`;
});

schema.pre('save', function setFullName() {
  const { name, size } = this;
  this.fullName = `${name} (${size})`;
});

module.exports = schema;
