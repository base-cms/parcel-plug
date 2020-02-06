const { Schema } = require('mongoose');
const connection = require('../connections/account');
const {
  deleteablePlugin,
  paginablePlugin,
  repositoryPlugin,
  userAttributionPlugin,
} = require('../plugins');

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  deliveryHostname: {
    type: String,
    trim: true,
  },
  cdnHostname: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

schema.virtual('hasCustomHosts').get(function hasCustomHosts() {
  const { deliveryHostname, cdnHostname } = this;
  return Boolean(deliveryHostname || cdnHostname);
});

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name'],
});
schema.plugin(userAttributionPlugin);

schema.method('isActive', async function isActive() {
  const deployments = await connection.model('deployment').find({ publisherId: this.id });
  const actives = await Promise.all(deployments.map(deployment => deployment.isActive()));
  return actives.some(v => v === true);
});

schema.pre('save', async function updateRelatedModels() {
  if (this.isModified('name')) {
    const [deployments, adunits] = await Promise.all([
      connection.model('deployment').find({ publisherId: this.id }),
      connection.model('adunit').find({ publisherId: this.id }),
    ]);

    deployments.forEach((deployment) => {
      deployment.set('publisherName', this.name);
      deployment.save();
    });
    adunits.forEach((adunit) => {
      adunit.set('publisherName', this.name);
      adunit.save();
    });
  }
});

schema.pre('save', async function checkDelete() {
  if (this.isModified('deleted') && this.deleted) {
    // Attempting to delete. Ensure no active deployments are found.
    const isActive = await this.isActive();
    if (isActive) throw new Error('Unable to delete publisher: active deployments were found.');
    // Okay to delete. Delete all associated deployments.
    const deployments = await connection.model('deployment').find({ publisherId: this.id });
    await Promise.all(deployments.map((deployment) => {
      deployment.set('deleted', true);
      return deployment.save();
    }));
  }
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
