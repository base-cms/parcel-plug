const s3 = require('./client');
const { S3_BUCKET: Bucket } = require('../env');

module.exports = () => new Promise((resolve, reject) => {
  s3.headBucket({ Bucket }, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});
