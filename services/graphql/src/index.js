require('./newrelic');
const http = require('http');
const { createTerminus } = require('@godaddy/terminus');
const app = require('./app');
const env = require('./env');
const health = require('./health');
const pkg = require('../package.json');
const start = require('./start');
const stop = require('./stop');
const { log } = require('./output');

const { INTERNAL_PORT, EXTERNAL_PORT } = env;
const server = http.createServer(app);

const run = async () => {
  // Await required services here...
  await start();

  createTerminus(server, {
    timeout: 1000,
    signals: ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT'],
    healthChecks: { '/_health': () => health() },
    onSignal: () => {
      log('> Cleaning up...');
      // Stop required services here...
      return stop().catch(e => log('> CLEANUP ERRORS:', e));
    },
    onShutdown: () => log('> Cleanup finished. Shutting down.'),
  });

  server.listen(INTERNAL_PORT, () => log(`> Ready on http://0.0.0.0:${EXTERNAL_PORT}`));
};

// Simulate future NodeJS behavior by throwing unhandled Promise rejections.
process.on('unhandledRejection', (e) => {
  log('> Unhandled promise rejection. Throwing error...');
  throw e;
});

log(`> Booting ${pkg.name} v${pkg.version}...`);
run().catch(e => setImmediate(() => { throw e; }));
