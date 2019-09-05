require('./newrelic');
const pkg = require('../package.json');
const db = require('./db');
const processor = require('./processor');

const { log } = console;

const start = () => {
  log('> Connecting to db...');
  return db.then((r) => {
    const { url } = r.client.s;
    log(`> db connected (${url})`);
    return r;
  });
};

const stop = () => {
  log('> Disconnecting from db...');
  return db.close().then((r) => {
    log('> db disconnected');
    return r;
  });
};

const run = async () => {
  await start();
  await processor();
  // Run the processor every 5 minutes
  setInterval(processor, 5 * 60 * 1000);
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
