const deepAssign = require('deep-assign');
const { classify } = require('inflection');
const GraphQLJSON = require('graphql-type-json');
const { GraphQLUpload } = require('apollo-server-express');
const User = require('../../mongoose/models/user');
const ad = require('./ad');
const lineitem = require('./lineitem');
const user = require('./user');
const report = require('./report');
const { DateType, ObjectIDType } = require('../types');

const resolveType = (doc) => {
  if (!doc || !doc.constructor) return null;
  const { modelName } = doc.constructor;
  return modelName ? classify(modelName.replace('-', '_')) : null;
};

module.exports = deepAssign(
  ad,
  lineitem,
  user,
  report,
  {
    /**
     * Custom scalar types.
     */
    Date: DateType,
    JSON: GraphQLJSON,
    ObjectID: ObjectIDType,
    Upload: GraphQLUpload,

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
