const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  advertiser(input: AdvertiserQueryInput!): Advertiser @requiresAuth
  advertisers(input: AdvertisersQueryInput = {}): AdvertiserConnection! @requiresAuth
}

extend type Mutation {
  createAdvertiser(input: CreateAdvertiserMutationInput!): Advertiser! @requiresAuth
  updateAdvertiser(input: UpdateAdvertiserMutationInput!): Advertiser! @requiresAuth
  deleteAdvertiser(input: DeleteAdvertiserMutationInput!): Advertiser! @requiresAuth

  advertiserName(input: AdvertiserNameMutationInput!): Advertiser! @requiresAuth @setAndUpdate(modelName: "advertiser", path: "name")
  advertiserWebsite(input: AdvertiserWebsiteMutationInput!): Advertiser! @requiresAuth @setAndUpdate(modelName: "advertiser", path: "website")
}

type Advertiser implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  website: String
}

type AdvertiserConnection {
  totalCount: Int!
  edges: [AdvertiserEdge]!
  pageInfo: PageInfo!
}

type AdvertiserEdge {
  node: Advertiser!
  cursor: String!
}

enum AdvertiserSortField {
  id
  name
  updatedAt
}

input CreateAdvertiserMutationInput {
  name: String!
  website: String
}

input UpdateAdvertiserMutationInput {
  id: ObjectID!
  payload: UpdateAdvertiserPayloadInput!
}

input DeleteAdvertiserMutationInput {
  id: ObjectID!
}

input UpdateAdvertiserPayloadInput {
  name: String!
  website: String
}

input AdvertiserQueryInput {
  id: ObjectID!
}

input AdvertisersQueryInput {
  sort: AdvertiserSortInput = {}
  pagination: PaginationInput = {}
}

input AdvertiserDeploymentsInput {
  sort: DeploymentSortInput = {}
  pagination: PaginationInput = {}
}

input AdvertiserSortInput {
  field: AdvertiserSortField = id
  order: SortOrder = desc
}

input AdvertiserNameMutationInput {
  id: ObjectID!
  value: String!
}

input AdvertiserWebsiteMutationInput {
  id: ObjectID!
  value: String
}

`;
