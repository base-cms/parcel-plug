const { mongo } = require('../connections');

module.exports = ({ _id, width, height }, type, { date, email, rand }) => {
  const correlator = Buffer.from(JSON.stringify({ date, email, rand })).toString('base64');

  // Write the click/view event
  mongo.db().collection('delivery-event').insertOne({ correlator, type, adunit: _id }, { upsert: true });

  // return mongo.db().collection('delivery-query').findOne({ adunit: _id, width, height, date });

  return {
    src: `https://placehold.it/${width}x${height}`,
    url: 'https://email-x.io',
  };
};
