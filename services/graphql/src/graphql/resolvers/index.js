const deepAssign = require('deep-assign');

module.exports = deepAssign(
  {
    /**
     * Root queries.
     */
    Query: {
      /**
       *
       */
      ping: () => 'pong',
    },
  },
);
