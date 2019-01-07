const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  publisher(input: PublisherQueryInput!): Publisher @requiresAuth
  publishers(input: PublishersQueryInput = {}): PublisherConnection! @requiresAuth
}

extend type Mutation {
  createPublisher(input: CreatePublisherMutationInput!): Publisher! @requiresAuth
  updatePublisher(input: UpdatePublisherMutationInput!): Publisher! @requiresAuth
}

type Publisher implements SoftDeleteable & Timestampable & UserAttributable @applyInterfaceFields {
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

input UpdatePublisherPayloadInput {
  name: String!
}

input PublisherQueryInput {
  id: ObjectID!
  deleted: Boolean = false
}

input PublishersQueryInput {
  deleted: Boolean = false
  sort: PublisherSortInput = {}
  pagination: PaginationInput = {}
}

input PublisherSortInput {
  field: PublisherSortField = id
  order: SortOrder = desc
}

`;
