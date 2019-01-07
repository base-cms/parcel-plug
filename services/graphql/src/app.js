const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const Auth = require('./auth');
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

/**
 * Authenticates a user via the `Authorization: Bearer` JWT.
 * If credentaials are present and valid, will add the `user` and `session`
 * context to `req.auth`.
 *
 * If the request is anonymous (no credentials provided), or the credentials
 * are invalid, an error is _not_ thrown. Instead, the `user` and `session`
 * contexts on `req.auth` are left `undefined` and, additionally, the `err` context is
 * added with the `Error` that was generated. It is possible for the `err` to be `null`,
 * in the case of anonymous users (e.g. `{ user: undefined, session: undefind, err: null }`).
 *
 * Ultimately, it will be up to the underlying Graph API, and the services
 * it uses, to determine when/if to throw authentication or authorization errors,
 * based on the specific graph action being performed.
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
app.use((req, res, next) => {
  passport.authenticate('bearer', { session: false }, (err, { user, session } = {}) => {
    const { portal } = req;
    req.auth = new Auth({
      user,
      session,
      portal,
      err,
    });
    next();
  })(req, res, next);
});

graphql({ app, endpoint: GRAPHQL_ENDPOINT });

// Redirect root domain requests to the app.
app.get('/', (req, res) => {
  res.redirect(301, '/app');
});

module.exports = app;
