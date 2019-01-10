const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  publisher(input: PublisherQueryInput!): Publisher @requiresAuth @retrieve(modelName: "publisher")
  publishers(input: PublishersQueryInput = {}): PublisherConnection! @requiresAuth @retrieveMany(modelName: "publisher")
  matchPublishers(input: MatchPublishersQueryInput!): PublisherConnection! @requiresAuth @matchMany(modelName: "publisher")
}

extend type Mutation {
  createPublisher(input: CreatePublisherMutationInput!): Publisher! @requiresAuth @create(modelName: "publisher")
  updatePublisher(input: UpdatePublisherMutationInput!): Publisher! @requiresAuth @update(modelName: "publisher")
  deletePublisher(input: DeletePublisherMutationInput!): Publisher! @requiresAuth @delete(modelName: "publisher")

  publisherName(input: PublisherNameMutationInput!): Publisher! @requiresAuth @setAndUpdate(modelName: "publisher", path: "name")
}

type Publisher implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  deployments(input: PublisherDeploymentsInput = {}): DeploymentConnection! @refMany(modelName: "deployment", localField: "_id", foreignField: "publisherId")
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

input PublisherDeploymentsInput {
  sort: DeploymentSortInput = {}
  pagination: PaginationInput = {}
}

input PublisherSortInput {
  field: PublisherSortField = id
  order: SortOrder = desc
}

input PublisherNameMutationInput {
  id: ObjectID!
  value: String!
}

input MatchPublishersQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

`;
