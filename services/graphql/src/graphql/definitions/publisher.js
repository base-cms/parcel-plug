const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  publisher(input: PublisherQueryInput!): Publisher @requiresAuth
  publishers(input: PublishersQueryInput = {}): PublisherConnection! @requiresAuth
}

extend type Mutation {
  createPublisher(input: CreatePublisherMutationInput!): Publisher! @requiresAuth
  updatePublisher(input: UpdatePublisherMutationInput!): Publisher! @requiresAuth
  deletePublisher(input: DeletePublisherMutationInput!): Publisher! @requiresAuth
}

type Publisher implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
}

type PublisherConnection {
  totalCount: Int!
  edges: [PublisherEdge]!
  pageInfo: PageInfo!
}

type PublisherEdge {
  node: Publisher!
  cursor: String!
}

enum PublisherSortField {
  id
  name
  updatedAt
}

input CreatePublisherMutationInput {
  name: String!
}

input UpdatePublisherMutationInput {
  id: ObjectID!
  payload: UpdatePublisherPayloadInput!
}

input DeletePublisherMutationInput {
  id: ObjectID!
}

input UpdatePublisherPayloadInput {
  name: String!
}

input PublisherQueryInput {
  id: ObjectID!
}

input PublishersQueryInput {
  sort: PublisherSortInput = {}
  pagination: PaginationInput = {}
}

input PublisherSortInput {
  field: PublisherSortField = id
  order: SortOrder = desc
}

`;
