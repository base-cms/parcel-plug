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

const { isArray } = Array;
const isObject = v => v && typeof v === 'object';

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
  type: {
    type: String,
    enum: ['range', 'days'],
    default: 'days',
  },
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
  notes: {
    type: String,
    required: false,
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
  ready: {
    type: Boolean,
    required: true,
    default: false,
  },
  paused: {
    type: Boolean,
    required: true,
    default: false,
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

schema.virtual('status').get(function getStatus() {
  const { dates } = this;

  const now = Date.now();
  let newestDay;
  let oldestDay;
  if (dates.type === 'days') {
    const days = isArray(dates.days) ? dates.days : [];
    const times = days.map(d => d.valueOf()).sort();
    [oldestDay] = times;
    [newestDay] = times.reverse();
  }

  if (this.deleted) return 'Deleted';
  if (dates.type === 'range' && dates.end && dates.end.valueOf() <= now) return 'Finished';
  if (dates.type === 'days' && newestDay && newestDay.valueOf() <= now) return 'Finished';
  if (!this.ready) return 'Incomplete';
  if (this.paused) return 'Paused';
  if (dates.type === 'range' && dates.start && dates.start.valueOf() <= now) return 'Running';
  if (dates.type === 'days' && oldestDay && oldestDay.valueOf() <= now) return 'Running';
  return 'Scheduled';
});

schema.method('clone', async function clone(user, orderId) {
  const Model = connection.model('lineitem');
  const { _doc } = this;
  const input = {
    ..._doc,
    paused: true,
    orderId: orderId || _doc.orderId,
    name: `${this.name} copy`,
  };
  ['id', '_id', 'createdAt', 'updatedAt', 'updatedBy', 'createdBy'].forEach(k => delete input[k]);

  const doc = new Model(input);
  doc.setUserContext(user);
  await doc.save();

  const lineitemId = doc.id;
  const ads = await connection.model('ad').find({ lineitemId: this.id });
  await Promise.all(ads.map(ad => ad.clone(user, orderId, lineitemId)));
  return doc;
});

schema.method('isActive', async function isActive() {
  const inactiveStatus = ['Deleted', 'Incomplete', 'Paused'];
  if (inactiveStatus.includes(this.status)) return false;
  const ads = await connection.model('ad').find({ lineitemId: this.id });
  return ads.some(ad => ad.status === 'Active');
});

schema.method('getRequirements', async function getRequirements() {
  const {
    targeting,
    dates,
  } = this;

  const needs = [];

  const targetingNeeds = 'at least one inventory selection';
  if (!isObject(targeting)) {
    needs.push(targetingNeeds);
  } else {
    const inventoryMap = {
      adunit: 'adunitIds',
      deployment: 'deploymentIds',
      publisher: 'publisherIds',
    };
    const targetingDocs = await Promise.all(Object.keys(inventoryMap).map((modelName) => {
      const key = inventoryMap[modelName];
      const values = targeting[key];
      if (isArray(values) && values.length) {
        return connection.model(modelName).find({
          _id: { $in: values },
          deleted: false,
        }, { _id: 1 });
      }
      return [];
    }));

    const hasTargetingDocs = targetingDocs.some(docs => docs.length);
    if (!hasTargetingDocs) needs.push(targetingNeeds);
  }

  const datesNeeds = 'a valid date range or selection of days';
  if (!isObject(dates)) {
    needs.push(datesNeeds);
  } else {
    switch (dates.type) {
      case 'range':
        if (!dates.start || !dates.end) needs.push(datesNeeds);
        break;
      case 'days':
        if (!isArray(dates.days) || !dates.days.length) needs.push(datesNeeds);
        break;
      default:
        needs.push(datesNeeds);
        break;
    }
  }

  const adNeeds = 'at least one active ad';
  const ads = await connection.model('ad').find({ lineitemId: this.id, deleted: false, paused: false });
  if (!ads.length || !ads.some(ad => ad.status === 'Active')) needs.push(adNeeds);
  return needs.sort().join(', ');
});

schema.pre('validate', async function setOrderAndAdvertiser() {
  if (this.isModified('orderId') || !this.orderName || !this.advertiserName || !this.advertiserId) {
    const order = await connection.model('order').findOne({ _id: this.orderId }, { name: 1, advertiserId: 1, advertiserName: 1 });
    this.orderName = order.name;
    this.advertiserName = order.advertiserName;
    this.advertiserId = order.advertiserId;
  }
});

schema.pre('validate', function setFullName() {
  const { name, orderName, advertiserName } = this;
  this.fullName = `${advertiserName} > ${orderName} > ${name}`;
});

schema.pre('save', async function updateRelatedModels() {
  if (this.isModified('orderId') || this.isModified('name')) {
    const ads = await connection.model('ad').find({ lineitemId: this.id });

    ads.forEach((ad) => {
      ad.set('orderId', this.orderId);
      ad.set('orderName', this.orderName);
      ad.set('advertiserId', this.advertiserId);
      ad.set('advertiserName', this.advertiserName);
      ad.set('lineitemName', this.name);
      ad.save().catch(e => logError(e));
    });
  }
});

schema.pre('save', async function updateEvents() {
  if (this.isModified('orderId')) {
    const { advertiserId, orderId } = this;
    ['view', 'click'].forEach((modelName) => {
      connection.model(modelName).updateMany({ lineitemId: this._id }, {
        $set: { advertiserId, orderId },
      }).catch(e => logError(e));
    });
  }
});

schema.pre('save', async function setReady() {
  const needs = await this.getRequirements();
  if (needs.length) {
    this.ready = false;
  } else {
    this.ready = true;
  }
});

schema.pre('save', async function checkDelete() {
  if (this.isModified('deleted') && this.deleted) {
    // Attempting to delete. Ensure no active ads are found.
    const isActive = await this.isActive();
    if (isActive) throw new Error('Unable to delete line item: active ads were found.');
  }
});

const removeCorrelators = lineitemId => connection.model('correlator').deleteMany({ lineitemId });

schema.post('save', async function updateSchedules() {
  const lineitem = this;
  const bulkOps = [
    { deleteMany: { filter: { lineitemId: lineitem._id } } },
  ];

  const isActive = await this.isActive();
  if (isActive) {
    // Only run on elgible statuses.
    const { targeting, priority, dates } = lineitem;
    const { adunitIds, deploymentIds, publisherIds } = targeting || {};

    const ids = {
      adunit: isArray(adunitIds) ? adunitIds : [],
      deployment: isArray(deploymentIds) ? deploymentIds : [],
      publisher: isArray(publisherIds) ? publisherIds : [],
    };

    const ads = await connection.model('ad').find({ lineitemId: lineitem.id });
    const activeAds = ads.filter(ad => ad.status === 'Active');

    const query = {
      $or: [
        { _id: { $in: ids.adunit } },
        { deploymentId: { $in: ids.deployment } },
        { publisherId: { $in: ids.publisher } },
      ],
      deleted: false,
    };
    const adunits = await connection.model('adunit').find(query);

    const endDay = day => new Date(day.valueOf() + (24 * 60 * 60 * 1000) - 1);

    const schedules = adunits.reduce((arr, adunit) => {
      const elgible = activeAds
        .filter(ad => ad.width === adunit.width && ad.height === adunit.height);

      if (elgible.length) {
        const winners = elgible.map(ad => ({ _id: ad._id, url: ad.url, src: ad.image.serveSrc }));
        if (dates.type === 'range') {
          arr.push({
            lineitemId: lineitem._id,
            adunitId: adunit._id,
            priority,
            start: dates.start,
            end: dates.end,
            ads: winners,
          });
        } else {
          dates.days.forEach((day) => {
            arr.push({
              lineitemId: lineitem._id,
              adunitId: adunit._id,
              priority,
              start: day,
              end: endDay(day),
              ads: winners,
            });
          });
        }
      }
      return arr;
    }, []);
    schedules.forEach((schedule) => {
      bulkOps.push({ insertOne: { document: schedule } });
    });
    if (!schedules.length) {
      // Remove correlators when schedules are found.
      await removeCorrelators(this._id);
    }
  } else {
    // The line item is no longer active. Remove correlators.
    // Prevents images and clicks from serving for previosuly correlated ads.
    await removeCorrelators(this._id);
  }
  // Execute the bulk write.
  return connection.model('schedule').bulkWrite(bulkOps);
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ advertiserName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ orderName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
