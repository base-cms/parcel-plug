const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const bearer = require('./auth/bearer');
const env = require('./env');
const graphql = require('./graphql/server');

const { GRAPHQL_ENDPOINT } = env;

const app = express();
app.set('trust proxy', 'loopback, linklocal, uniquelocal');

// Set passport auth.
passport.use(bearer);
app.use(passport.initialize());

const CORS = cors({
  methods: ['GET', 'POST'],
  maxAge: 600,
});

app.use(helmet());
app.use(CORS);
app.options('*', CORS);

graphql({ app, endpoint: GRAPHQL_ENDPOINT });

module.exports = app;
