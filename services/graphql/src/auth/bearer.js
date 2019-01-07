const { Strategy } = require('passport-http-bearer');
const userService = require('../services/user');

module.exports = new Strategy((token, next) => {
  userService.retrieveSession(token).then(data => next(null, data)).catch(() => {
    next(new Error('No active user session was found. Did you login?'));
  });
});
