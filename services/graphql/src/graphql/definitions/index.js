const gql = require('graphql-tag');
const user = require('./user');

module.exports = gql`

scalar Date
scalar ObjectID

directive @auth(requiresRole: UserRole) on FIELD_DEFINITION

type Query {
  ping: String!
}

${user}

`;
