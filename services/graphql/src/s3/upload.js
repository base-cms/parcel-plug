const uuid = require('uuid/v4');
const s3 = require('./client');
const { S3_BUCKET: Bucket, ACCOUNT_KEY } = require('../env');

module.exports = ({
  stream: Body,
  filename,
  mimetype: ContentType,
  folder = 'ads',
} = {}) => s3.upload({
  Bucket,
  Key: `${ACCOUNT_KEY}/${folder}/${uuid()}/${filename}`,
  Body,
  ACL: 'public-read',
  ContentType,
}).promise();
