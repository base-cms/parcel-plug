const db = require('../db');

module.exports = id => db.strictFindActiveById('adunits', id, {
  projection: { width: 1, height: 1 },
});
