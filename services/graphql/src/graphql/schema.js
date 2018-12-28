const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');
const typeDefs = require('./definitions');

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
