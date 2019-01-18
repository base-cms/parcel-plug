const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();
app.set('trust proxy', 'loopback, linklocal, uniquelocal');

app.use(helmet());
app.use(helmet.noCache());

routes(app);

module.exports = app;
