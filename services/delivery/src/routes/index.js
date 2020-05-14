const click = require('./click');
const data = require('./data');
const image = require('./image');

module.exports = (app) => {
  click(app);
  data(app);
  image(app);
};
