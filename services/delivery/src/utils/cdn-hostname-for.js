const db = require('../db');

module.exports = async (publisherId) => {
  const { cdnHostname } = await db.strictFindById('publishers', publisherId, {
    projection: { cdnHostname: 1 },
  });
  return cdnHostname;
};
