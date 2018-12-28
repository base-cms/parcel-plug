const deepAssign = require('deep-assign');
const { DateType, ObjectIDType } = require('../types');

module.exports = deepAssign(
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
