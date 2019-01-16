const click = require('./click');
const image = require('./image');

module.exports = (app) => {
  click(app);
  image(app);
};
