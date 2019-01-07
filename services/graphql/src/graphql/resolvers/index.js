const deepAssign = require('deep-assign');
const User = require('../../mongoose/models/user');
const publisher = require('./publisher');
const user = require('./user');
const { DateType, ObjectIDType } = require('../types');

const resolveType = (doc) => {
  console.log('resolveType', doc);
};

module.exports = deepAssign(
  publisher,
  user,
  {
    /**
     * Custom scalar types.
     */
    Date: DateType,
    ObjectID: ObjectIDType,

    /**
     * Interfaces
     */
    SoftDeleteable: { __resolveType: resolveType },
    Timestampable: { __resolveType: resolveType },
    UserAttributable: {
      __resolveType: resolveType,
      createdBy: ({ createdById }) => (createdById ? User.findById(createdById) : null),
      updatedBy: ({ updatedById }) => (updatedById ? User.findById(updatedById) : null),
    },

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
