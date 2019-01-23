const { Schema } = require('mongoose');
const { isURL } = require('validator');
const uuid = require('uuid/v4');
const { extname } = require('path');
const upload = require('../../s3/upload');
const connection = require('../connections/account');
const logError = require('../../log-error');
const {
  deleteablePlugin,
  paginablePlugin,
  referencePlugin,
  repositoryPlugin,
  userAttributionPlugin,
} = require('../plugins');
const imageSchema = require('./image');

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
  lineitemName: {
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
  url: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator(v) {
        if (!v) return false;
        return isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Invalid URL for {VALUE}',
    },
  },
  image: {
    type: imageSchema,
  },
}, { timestamps: true });

schema.plugin(referencePlugin, {
  name: 'lineitemId',
  connection,
  modelName: 'lineitem',
  options: { required: true },
});
schema.plugin(referencePlugin, {
  name: 'orderId',
  connection,
  modelName: 'order',
  options: { required: true },
});
schema.plugin(referencePlugin, {
  name: 'advertiserId',
  connection,
  modelName: 'advertiser',
  options: { required: true },
});

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name', 'advertiserName', 'orderName', 'lineitemName', 'size'],
});
schema.plugin(userAttributionPlugin);

schema.virtual('status').get(function getStatus() {
  if (this.deleted) return 'Deleted';
  if (!this.ready) return 'Incomplete';
  if (this.paused) return 'Paused';
  return 'Active';
});

schema.method('clone', async function clone(user, orderId, lineitemId) {
  const Model = connection.model('ad');
  const { _doc } = this;
  const input = {
    ..._doc,
    orderId: orderId || _doc.orderId,
    lineitemId: lineitemId || _doc.lineitemId,
    name: `${this.name} copy`,
  };
  ['id', '_id', 'createdAt', 'updatedAt', 'updatedBy', 'createdBy'].forEach(k => delete input[k]);

  const doc = new Model(input);
  doc.setUserContext(user);
  return doc.save();
});

schema.method('getRequirements', async function getRequirements() {
  const {
    width = 0,
    height = 0,
    image,
  } = this;

  const { width: w = 0, height: h = 0 } = image;
  const needs = [];

  const adRatio = height ? width / height : 0;
  const imageRatio = h ? w / h : 0;

  if (adRatio !== imageRatio) {
    needs.push('an image that matches the ad size');
  }
  return needs.sort().join(', ');
});

schema.method('uploadImage', async function uploadImage(file, { width, height, bytes }) {
  const {
    createReadStream,
    filename: name,
    mimetype,
  } = await file;

  const filename = `ads/${uuid()}${extname(name)}`;
  const params = {
    Metadata: {
      name,
      ad: this.id,
    },
  };

  const {
    Location: src,
    ETag: etag,
    Key: key,
    Bucket: bucket,
  } = await upload({
    stream: createReadStream(),
    filename,
    mimetype,
    params,
  });
  const image = {
    filename: name,
    src,
    s3: { bucket, key, etag: etag.replace(/"/g, '') },
    uploadedAt: new Date(),
    mimetype,
    width,
    height,
    size: parseInt(bytes, 10),
  };
  this.set('image', image);
  return this.save();
});

schema.pre('validate', function setSize() {
  const { width, height } = this;
  this.size = `${width}x${height}`;
});

schema.pre('validate', async function setRelatedFields() {
  const isEmpty = [
    'advertiserName',
    'orderName',
    'lineitemName',
  ].map(k => this.get(k)).some(v => !v);

  if (this.isModified('lineitemId') || isEmpty) {
    const lineitem = await connection.model('lineitem').findOne({ _id: this.lineitemId }, {
      name: 1,
      orderId: 1,
      orderName: 1,
      advertiserId: 1,
      advertiserName: 1,
    });
    this.lineitemName = lineitem.name;
    this.orderId = lineitem.orderId;
    this.orderName = lineitem.orderName;
    this.advertiserId = lineitem.advertiserId;
    this.advertiserName = lineitem.advertiserName;
  }
});

schema.pre('validate', function setFullName() {
  const {
    name,
    advertiserName,
    orderName,
    lineitemName,
    size,
  } = this;
  this.fullName = `${advertiserName} > ${orderName} > ${lineitemName} > ${name} (${size})`;
});

schema.pre('save', async function setReady() {
  const needs = await this.getRequirements();
  if (needs.length) {
    this.ready = false;
  } else {
    this.ready = true;
  }
});

schema.pre('save', async function updateEvents() {
  if (this.isModified('lineitemId')) {
    const { advertiserId, orderId, lineitemId } = this;
    ['view', 'click'].forEach((modelName) => {
      connection.model(modelName).updateMany({ adId: this._id }, {
        $set: { advertiserId, orderId, lineitemId },
      }).catch(e => logError(e));
    });
    // Update correlators
    connection.model('correlator').updateMany({ adId: this._id }, {
      $set: { lineitemId },
    }).catch(e => logError(e));
  }
});

schema.pre('save', async function updateCorrelators() {
  if (this.isModified('url') || this.isModified('image.src')) {
    const { url } = this;
    const { serveSrc: src } = this.image;
    connection.model('correlator').updateMany({ adId: this._id }, {
      $set: { url, src },
    }).catch(e => logError(e));
  }
});

schema.post('save', async function updateLineItem() {
  const lineitem = await connection.model('lineitem').findById(this.lineitemId);
  return lineitem ? lineitem.save() : null;
});

schema.post('save', async function removeCorrelators() {
  if (this.status !== 'Active') {
    // Remove all correlators for inactive ads.
    // Will no longer serve images or clicks that were previously correlated.
    await connection.model('correlator').deleteMany({ adId: this._id });
  }
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ advertiserName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ size: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
