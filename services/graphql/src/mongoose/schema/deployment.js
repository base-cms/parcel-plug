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
  publisherName: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

schema.plugin(referencePlugin, {
  name: 'publisherId',
  connection,
  modelName: 'publisher',
  options: { required: true },
});
schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name', 'publisherName'],
});
schema.plugin(userAttributionPlugin);

schema.method('isActive', async function isActive() {
  const adunits = await connection.model('adunit').find({ deploymentId: this.id });
  const actives = await Promise.all(adunits.map(adunit => adunit.isActive()));
  return actives.some(v => v === true);
});

schema.pre('validate', async function setPublisherInfo() {
  if (this.isModified('publisherId') || !this.publisherName) {
    const publisher = await connection.model('publisher').findOne({ _id: this.publisherId }, { name: 1 });
    this.publisherName = publisher.name;
  }
});

schema.pre('validate', function setFullName() {
  const { name, publisherName } = this;
  this.fullName = `${publisherName} > ${name}`;
});

schema.pre('save', async function updateRelatedModels() {
  if (this.isModified('publisherId') || this.isModified('name')) {
    const adunits = await connection.model('adunit').find({ deploymentId: this.id });

    adunits.forEach((adunit) => {
      adunit.set('publisherId', this.publisherId);
      adunit.set('publisherName', this.publisherName);
      adunit.set('deploymentName', this.name);
      adunit.save().catch(e => logError(e));
    });
  }
});

schema.pre('save', async function updateEvents() {
  if (this.isModified('publisherId')) {
    const { publisherId } = this;
    connection.model('event').updateMany({ deploymentId: this._id }, {
      $set: { publisherId },
    }).catch(e => logError(e));
  }
});

schema.pre('save', async function checkDelete() {
  if (this.isModified('deleted') && this.deleted) {
    // Attempting to delete. Ensure no active ad units are found.
    const isActive = await this.isActive();
    if (isActive) throw new Error('Unable to delete deployment: active ad units were found.');
  }
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ publisherName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
