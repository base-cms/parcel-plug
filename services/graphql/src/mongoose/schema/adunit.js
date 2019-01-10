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
  deploymentName: {
    type: String,
    required: true,
    trim: true,
  },
  publisherName: {
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
  collateWhen: ['name', 'size', 'publisherName', 'deploymentName'],
});
schema.plugin(userAttributionPlugin);

schema.pre('validate', function setSize() {
  const { width, height } = this;
  this.size = `${width}x${height}`;
});

// @todo If the publisher+deployment relationship changes, this will need to be updated!
schema.pre('validate', async function setDeploymentName() {
  if (this.isModified('deploymentId') || !this.deploymentName || !this.publisherName) {
    const deployment = await connection.model('deployment').findOne({ _id: this.deploymentId }, { name: 1, publisherId: 1 });
    const publisher = await connection.model('publisher').findOne({ _id: deployment.publisherId }, { name: 1 });
    this.deploymentName = deployment.name;
    this.publisherName = publisher.name;
  }
});

schema.pre('validate', function setFullName() {
  const {
    name,
    size,
    deploymentName,
    publisherName,
  } = this;
  this.fullName = `${name} (${size}) [${deploymentName} - ${publisherName}]`;
});

module.exports = schema;
