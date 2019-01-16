const s3 = require('./client');
const { S3_BUCKET: Bucket } = require('../env');

module.exports = () => s3.headBucket({ Bucket }).promise();
