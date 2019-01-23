const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  lineitem(input: LineItemQueryInput!): LineItem @requiresAuth @retrieve(modelName: "lineitem")
  lineitems(input: LineItemsQueryInput = {}): LineItemConnection! @requiresAuth @retrieveMany(modelName: "lineitem")
  matchLineItems(input: MatchLineItemsQueryInput!): LineItemConnection! @requiresAuth @matchMany(modelName: "lineitem")

  lineitemsForOrder(input: LineItemsForOrderQueryInput!): LineItemConnection! @requiresAuth @retrieveMany(modelName: "lineitem", using: { orderId: "orderId" })
  matchLineItemsForOrder(input: MatchLineItemsForOrderQueryInput!): LineItemConnection! @requiresAuth @matchMany(modelName: "lineitem", using: { orderId: "orderId" })
  lineitemsForAdvertiser(input: LineItemsForAdvertiserQueryInput!): LineItemConnection! @requiresAuth @retrieveMany(modelName: "lineitem", using: { advertiserId: "advertiserId" })
  matchLineItemsForAdvertiser(input: MatchLineItemsForAdvertiserQueryInput!): LineItemConnection! @requiresAuth @matchMany(modelName: "lineitem", using: { advertiserId: "advertiserId" })
}

extend type Mutation {
  createLineItem(input: CreateLineItemMutationInput!): LineItem! @requiresAuth @create(modelName: "lineitem")
  updateLineItem(input: UpdateLineItemMutationInput!): LineItem! @requiresAuth @update(modelName: "lineitem")
  deleteLineItem(input: DeleteLineItemMutationInput!): LineItem! @requiresAuth @delete(modelName: "lineitem")
  cloneLineItem(input: CloneLineItemMutationInput!): LineItem! @requiresAuth

  lineitemName(input: LineItemNameMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "name")
  lineitemNotes(input: LineItemNotesMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "notes")
  lineitemPriority(input: LineItemPriorityMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "priority")
  lineitemPaused(input: LineItemPausedMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "paused")
  lineitemAdUnits(input: LineItemAdUnitsMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "targeting.adunitIds")
  lineitemDeployments(input: LineItemDeploymentsMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "targeting.deploymentIds")
  lineitemPublishers(input: LineItemPublishersMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "targeting.publisherIds")
  lineitemDateDays(input: LineItemDateDaysMutationInput): LineItem! @requiresAuth
  lineitemDateRange(input: LineItemDateRangeMutationInput): LineItem! @requiresAuth
}

enum LineItemStatus {
  Deleted
  Finished
  Incomplete
  Paused
  Running
  Scheduled
}

type LineItem implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  notes: String
  status: LineItemStatus!
  paused: Boolean!
  requires: String!
  fullName: String!
  advertiser: Advertiser! @refOne(modelName: "advertiser", localField: "advertiserId", foreignField: "_id")
  order: Order! @refOne(modelName: "order", localField: "orderId", foreignField: "_id")
  targeting: LineItemTargeting!
  dates: LineItemDates!
  priority: Int!
  ads(input: LineItemAdsInput = {}): AdConnection! @refMany(modelName: "ad", localField: "_id", foreignField: "lineitemId")
}

type LineItemTargeting {
  adunits: [AdUnit!]!
  deployments: [Deployment!]!
  publishers: [Publisher!]!
}

type LineItemDates {
  type: LineItemDateType
  start: Date
  end: Date
  days: [Date]!
}

type LineItemConnection {
  totalCount: Int!
  edges: [LineItemEdge]!
  pageInfo: PageInfo!
}

type LineItemEdge {
  node: LineItem!
  cursor: String!
}

enum LineItemDateType {
  range
  days
}

enum LineItemSortField {
  id
  name
  advertiserName
  orderName
  createdAt
  updatedAt
}

input CreateLineItemMutationInput {
  name: String!
  orderId: ObjectID!
}

input UpdateLineItemMutationInput {
  id: ObjectID!
  payload: UpdateLineItemPayloadInput!
}

input CloneLineItemMutationInput {
  id: ObjectID!
}

input DeleteLineItemMutationInput {
  id: ObjectID!
}

input UpdateLineItemPayloadInput {
  name: String!
  orderId: ObjectID!
}

input LineItemQueryInput {
  id: ObjectID!
}

input LineItemsQueryInput {
  sort: LineItemSortInput = {}
  pagination: PaginationInput = {}
}

input LineItemSortInput {
  field: LineItemSortField = id
  order: SortOrder = desc
}

input LineItemNameMutationInput {
  id: ObjectID!
  value: String!
}

input LineItemNotesMutationInput {
  id: ObjectID!
  value: String!
}

input LineItemPriorityMutationInput {
  id: ObjectID!
  value: Int!
}

input LineItemPausedMutationInput {
  id: ObjectID!
  value: Boolean!
}

input LineItemAdUnitsMutationInput {
  id: ObjectID!
  value: [ObjectID!]!
}

input LineItemDeploymentsMutationInput {
  id: ObjectID!
  value: [ObjectID!]!
}

input LineItemDateDaysMutationInput {
  id: ObjectID!
  days: [Date!]!
}

input LineItemDateRangeMutationInput {
  id: ObjectID!
  start: Date!
  end: Date!
}

input LineItemPublishersMutationInput {
  id: ObjectID!
  value: [ObjectID!]!
}

input MatchLineItemsQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input LineItemsForOrderQueryInput {
  orderId: ObjectID!
  sort: LineItemSortInput = {}
  pagination: PaginationInput = {}
}

input MatchLineItemsForOrderQueryInput {
  orderId: ObjectID!
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input LineItemsForAdvertiserQueryInput {
  advertiserId: ObjectID!
  sort: LineItemSortInput = {}
  pagination: PaginationInput = {}
}

input MatchLineItemsForAdvertiserQueryInput {
  advertiserId: ObjectID!
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input LineItemAdsInput {
  sort: AdSortInput = {}
  pagination: PaginationInput = {}
}

`;
