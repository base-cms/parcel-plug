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
  advertiserName: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

schema.plugin(referencePlugin, {
  name: 'advertiserId',
  connection,
  modelName: 'advertiser',
  options: { required: true },
});
schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name', 'advertiserName'],
});
schema.plugin(userAttributionPlugin);

schema.method('clone', async function clone(user) {
  const Model = connection.model('order');
  const { _doc } = this;
  const input = {
    ..._doc,
    name: `${this.name} copy`,
  };
  ['id', '_id', 'createdAt', 'updatedAt', 'updatedBy', 'createdBy'].forEach(k => delete input[k]);

  const doc = new Model(input);
  doc.setUserContext(user);
  await doc.save();

  const orderId = doc.id;
  const lineitems = await connection.model('lineitem').find({ orderId: this.id });
  await Promise.all(lineitems.map(lineitem => lineitem.clone(user, orderId)));
  return doc;
});

schema.method('isActive', async function isActive() {
  const lineitems = await connection.model('lineitem').find({ orderId: this.id });
  const actives = await Promise.all(lineitems.map(lineitem => lineitem.isActive()));
  return actives.some(v => v === true);
});

schema.pre('validate', async function setAdvertiserName() {
  if (this.isModified('advertiserId') || !this.advertiserName) {
    const advertiser = await connection.model('advertiser').findOne({ _id: this.advertiserId }, { name: 1 });
    this.advertiserName = advertiser.name;
  }
});

schema.pre('validate', function setFullName() {
  const { name, advertiserName } = this;
  this.fullName = `${advertiserName} > ${name}`;
});

schema.pre('save', async function updateRelatedModels() {
  if (this.isModified('advertiserId') || this.isModified('name')) {
    const [lineitems, ads] = await Promise.all([
      connection.model('lineitem').find({ orderId: this.id }),
      connection.model('ad').find({ orderId: this.id }),
    ]);

    lineitems.forEach((lineitem) => {
      lineitem.set('advertiserId', this.advertiserId);
      lineitem.set('advertiserName', this.advertiserName);
      lineitem.set('orderName', this.name);
      lineitem.save().catch(e => logError(e));
    });

    ads.forEach((ad) => {
      ad.set('advertiserId', this.advertiserId);
      ad.set('advertiserName', this.advertiserName);
      ad.set('orderName', this.name);
      ad.save().catch(e => logError(e));
    });
  }
});

schema.pre('save', async function updateEvents() {
  if (this.isModified('advertiserId')) {
    const { advertiserId } = this;
    const criteria = { orderId: this._id, type: { $in: ['view', 'click'] } };
    connection.model('event').updateMany(criteria, {
      $set: { advertiserId },
    }).catch(e => logError(e));
  }
});

schema.pre('save', async function checkDelete() {
  if (this.isModified('deleted') && this.deleted) {
    // Attempting to delete. Ensure no active line items are found.
    const isActive = await this.isActive();
    if (isActive) throw new Error('Unable to delete order: active line items were found.');
    // Okay to delete. Delete all associated line items.
    const lineitems = await connection.model('lineitem').find({ orderId: this.id });
    await Promise.all(lineitems.map((lineitem) => {
      lineitem.set('deleted', true);
      return lineitem.save();
    }));
  }
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ advertiserName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
