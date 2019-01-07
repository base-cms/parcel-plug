const gql = require('graphql-tag');
const user = require('./user');

module.exports = gql`

scalar Date
scalar ObjectID

type Query {
  ping: String!
}

${user}

`;
