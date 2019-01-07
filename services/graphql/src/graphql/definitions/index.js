const gql = require('graphql-tag');
const publisher = require('./publisher');
const user = require('./user');

module.exports = gql`

scalar Date
scalar ObjectID

directive @applyInterfaceFields on OBJECT
directive @requiresAuth(role: UserRole) on FIELD_DEFINITION

type Query {
  ping: String!
}

type Mutation {
  logoutUser: String
}

interface SoftDeleteable {
  deleted: Boolean!
}

interface Timestampable {
  createdAt: Date
  updatedAt: Date
}

interface UserAttributable {
  createdBy: User
  updatedBy: User
}


${publisher}
${user}

`;
