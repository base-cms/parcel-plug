const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  adunit(input: AdUnitQueryInput!): AdUnit @requiresAuth @retrieve(modelName: "adunit")
  adunits(input: AdUnitsQueryInput = {}): AdUnitConnection! @requiresAuth @retrieveMany(modelName: "adunit")
  matchAdUnits(input: MatchAdUnitsQueryInput!): AdUnitConnection! @requiresAuth @matchMany(modelName: "adunit")
}

extend type Mutation {
  createAdUnit(input: CreateAdUnitMutationInput!): AdUnit! @requiresAuth @create(modelName: "adunit")
  updateAdUnit(input: UpdateAdUnitMutationInput!): AdUnit! @requiresAuth @update(modelName: "adunit")
  deleteAdUnit(input: DeleteAdUnitMutationInput!): AdUnit! @requiresAuth @delete(modelName: "adunit")

  adunitName(input: AdUnitNameMutationInput!): AdUnit! @requiresAuth @setAndUpdate(modelName: "adunit", path: "name")
  adunitWidth(input: AdUnitWidthMutationInput!): AdUnit! @requiresAuth @setAndUpdate(modelName: "adunit", path: "width")
  adunitHeight(input: AdUnitHeightMutationInput!): AdUnit! @requiresAuth @setAndUpdate(modelName: "adunit", path: "height")
  adunitDeployment(input: AdUnitDeploymentMutationInput!): AdUnit! @requiresAuth @setAndUpdate(modelName: "adunit", path: "deploymentId")
}

type AdUnit implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  fullName: String!
  width: Int!
  height: Int!
  size: String!
  deployment: Deployment! @refOne(modelName: "deployment", localField: "deploymentId", foreignField: "_id")
}

type AdUnitConnection {
  totalCount: Int!
  edges: [AdUnitEdge]!
  pageInfo: PageInfo!
}

type AdUnitEdge {
  node: AdUnit!
  cursor: String!
}

enum AdUnitSortField {
  id
  name
  size
  deploymentName
  publisherName
  updatedAt
}

input CreateAdUnitMutationInput {
  name: String!
  width: Int!
  height: Int!
  deploymentId: ObjectID!
}

input UpdateAdUnitMutationInput {
  id: ObjectID!
  payload: UpdateAdUnitPayloadInput!
}

input DeleteAdUnitMutationInput {
  id: ObjectID!
}

input UpdateAdUnitPayloadInput {
  name: String!
  width: Int!
  height: Int!
  deploymentId: ObjectID!
}

input AdUnitQueryInput {
  id: ObjectID!
}

input AdUnitsQueryInput {
  sort: AdUnitSortInput = {}
  pagination: PaginationInput = {}
}

input AdUnitSortInput {
  field: AdUnitSortField = id
  order: SortOrder = desc
}

input MatchAdUnitsQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input AdUnitNameMutationInput {
  id: ObjectID!
  value: String!
}

input AdUnitWidthMutationInput {
  id: ObjectID!
  value: Int!
}

input AdUnitHeightMutationInput {
  id: ObjectID!
  value: Int!
}

input AdUnitDeploymentMutationInput {
  id: ObjectID!
  value: ObjectID!
}

`;