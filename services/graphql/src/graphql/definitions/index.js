const gql = require('graphql-tag');

module.exports = gql`

scalar Date
scalar ObjectID

type Query {
  ping: String!
}

`;
