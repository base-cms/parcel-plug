const { Schema } = require('mongoose');
const { isURL } = require('validator');
const connection = require('../connections/account');
const logError = require('../../log-error');
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
  website: {
    type: String,
    trim: true,
    validate: {
      validator(v) {
        if (!v) return true;
        return isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Invalid publisher website URL for {VALUE}',
    },
  },
}, { timestamps: true });

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name'],
});
schema.plugin(userAttributionPlugin);

schema.pre('save', async function updateOrders() {
  if (this.isModified('name')) {
    const [orders, lineitems, ads] = await Promise.all([
      connection.model('order').find({ advertiserId: this.id }),
      connection.model('lineitem').find({ advertiserId: this.id }),
      connection.model('ad').find({ advertiserId: this.id }),
    ]);
    orders.forEach((order) => {
      order.set('advertiserName', this.name);
      order.save().catch(e => logError(e));
    });
    lineitems.forEach((lineitem) => {
      lineitem.set('advertiserName', this.name);
      lineitem.save().catch(e => logError(e));
    });
    ads.forEach((ad) => {
      ad.set('advertiserName', this.name);
      ad.save().catch(e => logError(e));
    });
  }
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
