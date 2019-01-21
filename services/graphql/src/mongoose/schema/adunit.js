const { Schema } = require('mongoose');
const connection = require('../connections/account');
const logError = require('../../log-error');
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

schema.plugin(referencePlugin, {
  name: 'publisherId',
  connection,
  modelName: 'publisher',
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

schema.pre('validate', async function setPublisherAndDeploymentInfo() {
  if (this.isModified('deploymentId') || !this.deploymentName || !this.publisherName || !this.publisherId) {
    const deployment = await connection.model('deployment').findOne({ _id: this.deploymentId }, { name: 1, publisherId: 1, publisherName: 1 });
    this.publisherId = deployment.publisherId;
    this.publisherName = deployment.publisherName;
    this.deploymentName = deployment.name;
  }
});

schema.pre('validate', function setFullName() {
  const {
    name,
    size,
    deploymentName,
    publisherName,
  } = this;
  this.fullName = `${publisherName} > ${deploymentName} > ${name} (${size})`;
});

schema.pre('save', async function updateEvents() {
  if (this.isModified('deploymentId')) {
    const { publisherId, deploymentId } = this;
    ['request', 'view', 'click'].forEach((modelName) => {
      connection.model(modelName).updateMany({ adunitId: this._id }, {
        $set: { publisherId, deploymentId },
      }).catch(e => logError(e));
    });
  }
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ size: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ deploymentName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ publisherName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
