const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  publisher(input: PublisherQueryInput!): Publisher @requiresAuth
}

extend type Mutation {
  createPublisher(input: CreatePublisherMutationInput!): Publisher! @requiresAuth
}

type Publisher implements SoftDeleteable & Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
}

input CreatePublisherMutationInput {
  name: String!
}

input PublisherQueryInput {
  id: ObjectID!
  deleted: Boolean = false
}

`;
