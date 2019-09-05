const clickFrequency = require('./rules/click-frequency');

const { log } = console;

module.exports = async () => {
  log('Processing rules');
  await Promise.all([
    clickFrequency(),
  ]);
  log('Done processing.');
};
