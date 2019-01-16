const { mongo } = require('../connections');

module.exports = ({ _id, width, height }, type, query) => {
  const { date, email, rand } = query;
  if (query.placeholder) {
    return {
      src: `https://placehold.it/${width}x${height}`,
      url: 'https://email-x.io',
    };
  }

  const correlator = Buffer.from(JSON.stringify({ date, email, rand })).toString('base64');

  // Write the click/view event
  mongo.db().collection('delivery-event').updateOne({ correlator, type, adunit: _id }, { $inc: { count: 1 } }, { upsert: true });

  // Return the winning creative
  return mongo.db().collection('delivery-query').findOne({
    adunit: _id,
    width,
    height,
    date,
  });
};
