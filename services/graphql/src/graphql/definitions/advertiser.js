const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  advertiser(input: AdvertiserQueryInput!): Advertiser @requiresAuth @retrieve(modelName: "advertiser")
  advertisers(input: AdvertisersQueryInput = {}): AdvertiserConnection! @requiresAuth @retrieveMany(modelName: "advertiser")
  matchAdvertisers(input: MatchAdvertisersQueryInput!): AdvertiserConnection! @requiresAuth @matchMany(modelName: "advertiser")
}

extend type Mutation {
  createAdvertiser(input: CreateAdvertiserMutationInput!): Advertiser! @requiresAuth @create(modelName: "advertiser")
  updateAdvertiser(input: UpdateAdvertiserMutationInput!): Advertiser! @requiresAuth @update(modelName: "advertiser")
  deleteAdvertiser(input: DeleteAdvertiserMutationInput!): Advertiser! @requiresAuth @delete(modelName: "advertiser")

  advertiserName(input: AdvertiserNameMutationInput!): Advertiser! @requiresAuth @setAndUpdate(modelName: "advertiser", path: "name")
  advertiserWebsite(input: AdvertiserWebsiteMutationInput!): Advertiser! @requiresAuth @setAndUpdate(modelName: "advertiser", path: "website")
}

type Advertiser implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  website: String
  orders(input: AdvertiserOrdersInput = {}): OrderConnection! @refMany(modelName: "order", localField: "_id", foreignField: "advertiserId")
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

input MatchAdvertisersQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
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

input AdvertiserOrdersInput {
  sort: OrderSortInput = {}
  pagination: PaginationInput = {}
}

`;
