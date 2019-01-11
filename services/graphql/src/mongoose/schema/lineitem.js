const { Schema } = require('mongoose');
const connection = require('../connections/account');
const {
  deleteablePlugin,
  paginablePlugin,
  referencePlugin,
  repositoryPlugin,
  userAttributionPlugin,
} = require('../plugins');

const targetingSchema = new Schema({});
targetingSchema.plugin(referencePlugin, {
  name: 'adunitIds',
  many: true,
  connection,
  modelName: 'adunit',
});
targetingSchema.plugin(referencePlugin, {
  name: 'deploymentIds',
  many: true,
  connection,
  modelName: 'deployment',
});
targetingSchema.plugin(referencePlugin, {
  name: 'publisherIds',
  many: true,
  connection,
  modelName: 'publisher',
});

const datesSchema = new Schema({
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  days: {
    type: [Date],
  },
});

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
  orderName: {
    type: String,
    required: true,
    trim: true,
  },
  dates: {
    type: datesSchema,
    default: {},
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  targeting: {
    type: targetingSchema,
    default: {},
  },
}, { timestamps: true });

schema.plugin(referencePlugin, {
  name: 'advertiserId',
  connection,
  modelName: 'advertiser',
  options: { required: true },
});

schema.plugin(referencePlugin, {
  name: 'orderId',
  connection,
  modelName: 'order',
  options: { required: true },
});

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name', 'advertiserName', 'orderName'],
});
schema.plugin(userAttributionPlugin);

// @todo If the order name changes, this will also have to change.
schema.pre('validate', async function setOrderAndAdvertiser() {
  if (this.isModified('orderId') || !this.orderName || !this.advertiserName || !this.advertiserId) {
    const order = await connection.model('order').findOne({ _id: this.orderId }, { name: 1, advertiserId: 1 });
    const advertiser = await connection.model('advertiser').findOne({ _id: order.advertiserId }, { name: 1 });
    this.orderName = order.name;
    this.advertiserName = advertiser.name;
    this.advertiserId = advertiser.id;
  }
});

schema.pre('validate', function setFullName() {
  const { name, orderName, advertiserName } = this;
  this.fullName = `${name} [${orderName}] (${advertiserName})`;
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ advertiserName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ orderName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
