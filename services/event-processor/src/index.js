require('./newrelic');
const pkg = require('../package.json');
const db = require('./db');
const clickFrequency = require('./rules/click-frequency');

const { log } = console;

const stop = () => db.close();

const run = async () => {
  const r = await db;
  const { url } = r.client.s;
  log(`> db connected (${url})`);

  log('Processing rules');
  await Promise.all([
    clickFrequency(),
  ]);
  log('Done processing.');

  return stop();
};

// Simulate future NodeJS behavior by throwing unhandled Promise rejections.
process.on('unhandledRejection', (e) => {
  log('> Unhandled promise rejection. Throwing error...');
  throw e;
});

process.on('SIGINT', async () => {
  log('> SIGINT recieved, shutting down gracefully.');
  await stop();
});

process.on('SIGTERM', () => {
  log('> SIGTERM recieved, shutting down!');
  stop();
  process.exit();
});

log(`> Booting ${pkg.name} v${pkg.version}...`);
run().catch(e => setImmediate(() => { throw e; }));
