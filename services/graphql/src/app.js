const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const CORS = cors({
  methods: ['GET', 'POST'],
  maxAge: 600,
});

app.use(helmet());
app.use(CORS);
app.options('*', CORS);

module.exports = app;
