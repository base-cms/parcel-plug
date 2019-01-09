const gql = require('graphql-tag');
const advertiser = require('./advertiser');
const deployment = require('./deployment');
const publisher = require('./publisher');
const user = require('./user');

module.exports = gql`

scalar Date
scalar ObjectID

directive @applyInterfaceFields on OBJECT
directive @create(modelName: String!) on FIELD_DEFINITION
directive @delete(modelName: String!) on FIELD_DEFINITION
directive @requiresAuth(role: UserRole) on FIELD_DEFINITION
directive @retrieve(modelName: String!) on FIELD_DEFINITION
directive @retrieveMany(modelName: String!) on FIELD_DEFINITION
directive @setAndUpdate(modelName: String!, path: String!) on FIELD_DEFINITION
directive @update(modelName: String!) on FIELD_DEFINITION

type Query {
  ping: String!
}

type Mutation {
  logoutUser: String
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

interface Timestampable {
  createdAt: Date
  updatedAt: Date
}

interface UserAttributable {
  createdBy: User
  updatedBy: User
}

enum SortOrder {
  asc
  desc
}

input PaginationInput {
  limit: Int = 10
  after: String
}

${advertiser}
${deployment}
${publisher}
${user}

`;
