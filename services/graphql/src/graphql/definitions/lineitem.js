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

  lineitemName(input: LineItemNameMutationInput!): LineItem! @requiresAuth @setAndUpdate(modelName: "lineitem", path: "name")
}

type LineItem implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  fullName: String!
  advertiser: Advertiser! @refOne(modelName: "advertiser", localField: "advertiserId", foreignField: "_id")
  order: Order! @refOne(modelName: "order", localField: "orderId", foreignField: "_id")
  criteria: LineItemCriteria!
  dates: LineItemDates!
  priority: Int!
}

type LineItemCriteria {
  adunits: [AdUnit!]!
  deployments: [Deployment!]!
  publishers: [Publisher!]!
}

type LineItemDates {
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

`;
