const http = require('http');
const { createTerminus } = require('@godaddy/terminus');
const app = require('./app');
const pkg = require('../package.json');
const { log } = require('./output');

const { PORT } = process.env;
const server = http.createServer(app);

const run = async () => {
  // Await required services here...

  createTerminus(server, {
    timeout: 1000,
    signals: ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT'],
    healthChecks: { '/_health': () => 'ok' },
    onSignal: () => {
      log('> Cleaning up...');
      // Stop required services here...
    },
    onShutdown: () => log('> Cleanup finished. Shutting down.'),
  });

  server.listen(PORT, () => log(`> Ready on http://0.0.0.0:${PORT}`));
};

// Simulate future NodeJS behavior by throwing unhandled Promise rejections.
process.on('unhandledRejection', (e) => {
  log('> Unhandled promise rejection. Throwing error...');
  throw e;
});

log(`> Booting ${pkg.name} v${pkg.version}...`);
run().catch(e => setImmediate(() => { throw e; }));
