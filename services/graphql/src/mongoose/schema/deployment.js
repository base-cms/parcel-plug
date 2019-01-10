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
  collateWhen: ['name'],
});
schema.plugin(userAttributionPlugin);

schema.pre('validate', async function setPublisherName() {
  if (this.isModified('publisherId') || !this.publisherName) {
    const publisher = await connection.model('publisher').findOne({ _id: this.publisherId }, { name: 1 });
    this.publisherName = publisher.name;
  }
});

schema.pre('validate', function setFullName() {
  const { name, publisherName } = this;
  this.fullName = `${name} (${publisherName})`;
});

module.exports = schema;
