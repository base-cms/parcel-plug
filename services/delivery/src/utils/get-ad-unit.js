const db = require('../db');

module.exports = id => db.strictFindActiveById('adunits', id, {
  projection: { deploymentId: 1, publisherId: 1 },
});
