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
}, { timestamps: true });

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name'],
});
schema.plugin(userAttributionPlugin);

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

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
