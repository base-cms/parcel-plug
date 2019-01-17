const { Schema } = require('mongoose');
const { isURL } = require('validator');
const uuid = require('uuid/v4');
const { extname } = require('path');
const upload = require('../../s3/upload');
const connection = require('../connections/account');
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
  name: 'advertiserId',
  connection,
  modelName: 'advertiser',
  options: { required: true },
});

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name', 'advertiserName', 'size'],
});
schema.plugin(userAttributionPlugin);

schema.virtual('status').get(function getStatus() {
  if (this.deleted) return 'Deleted';
  if (!this.ready) return 'Incomplete';
  if (this.paused) return 'Paused';
  return 'Active';
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

// @todo If the advertiser name changes, this will also have to change.
schema.pre('validate', async function setPublisherName() {
  if (this.isModified('advertiserId') || !this.advertiserName) {
    const lineitem = await connection.model('lineitem').findOne({ _id: this.lineitemId }, { advertiserId: 1 });
    const advertiser = await connection.model('advertiser').findOne({ _id: lineitem.advertiserId }, { name: 1 });
    this.advertiserId = advertiser.id;
    this.advertiserName = advertiser.name;
  }
});

schema.pre('validate', function setFullName() {
  const { name, advertiserName, size } = this;
  this.fullName = `${advertiserName} > ${name} (${size})`;
});

schema.pre('save', async function setReady() {
  const needs = await this.getRequirements();
  if (needs.length) {
    this.ready = false;
  } else {
    this.ready = true;
  }
});

schema.post('save', async function updateLineItem() {
  const lineitem = await connection.model('lineitem').findById(this.lineitemId);
  return lineitem ? lineitem.save() : null;
});

schema.index({ name: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ advertiserName: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ size: 1, _id: 1 }, { collation: { locale: 'en_US' } });
schema.index({ updatedAt: 1, _id: 1 });
schema.index({ createdAt: 1, _id: 1 });

module.exports = schema;
