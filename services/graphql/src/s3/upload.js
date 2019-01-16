const s3 = require('./client');
const { S3_BUCKET: Bucket, ACCOUNT_KEY } = require('../env');

module.exports = ({
  stream: Body,
  filename,
  mimetype: ContentType,
  params = {},
} = {}) => s3.upload({
  ...params,
  Bucket,
  Key: `${ACCOUNT_KEY}/${filename}`,
  Body,
  ACL: 'public-read',
  ContentType,
}).promise();
