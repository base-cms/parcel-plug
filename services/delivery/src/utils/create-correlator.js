const hash = require('object-hash');

module.exports = ({
  adunitid,
  date,
  email,
  rand,
}) => hash({
  id: `${adunitid}`,
  date: date.valueOf(),
  email,
  rand,
});
