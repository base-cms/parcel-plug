const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./env');
const graphql = require('./graphql/server');

const { GRAPHQL_ENDPOINT } = env;

const app = express();
const CORS = cors({
  methods: ['GET', 'POST'],
  maxAge: 600,
});

app.use(helmet());
app.use(CORS);
app.options('*', CORS);

graphql({ app, endpoint: GRAPHQL_ENDPOINT });

module.exports = app;
