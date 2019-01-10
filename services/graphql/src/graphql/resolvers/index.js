const deepAssign = require('deep-assign');
const { classify } = require('inflection');
const User = require('../../mongoose/models/user');
const deployment = require('./deployment');
const user = require('./user');
const { DateType, ObjectIDType } = require('../types');

const resolveType = (doc) => {
  if (!doc || !doc.constructor) return null;
  const { modelName } = doc.constructor;
  return modelName ? classify(modelName.replace('-', '_')) : null;
};

module.exports = deepAssign(
  deployment,
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
