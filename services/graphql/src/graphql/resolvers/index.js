const deepAssign = require('deep-assign');
const { DateType, ObjectIDType } = require('../types');
const user = require('./user');

module.exports = deepAssign(
  user,
  {
    /**
     * Custom scalar types.
     */
    Date: DateType,
    ObjectID: ObjectIDType,

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
