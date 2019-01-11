const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  order(input: OrderQueryInput!): Order @requiresAuth @retrieve(modelName: "order")
  orders(input: OrdersQueryInput = {}): OrderConnection! @requiresAuth @retrieveMany(modelName: "order")
  matchOrders(input: MatchOrdersQueryInput!): OrderConnection! @requiresAuth @matchMany(modelName: "order")

  ordersForAdvertiser(input: OrdersForAdvertiserQueryInput!): OrderConnection! @requiresAuth @retrieveMany(modelName: "order", using: { advertiserId: "advertiserId" })
  matchOrdersForAdvertiser(input: MatchOrdersForAdvertiserQueryInput!): OrderConnection! @requiresAuth @matchMany(modelName: "order", using: { advertiserId: "advertiserId" })
}

extend type Mutation {
  createOrder(input: CreateOrderMutationInput!): Order! @requiresAuth @create(modelName: "order")
  updateOrder(input: UpdateOrderMutationInput!): Order! @requiresAuth @update(modelName: "order")
  deleteOrder(input: DeleteOrderMutationInput!): Order! @requiresAuth @delete(modelName: "order")

  orderName(input: OrderNameMutationInput!): Order! @requiresAuth @setAndUpdate(modelName: "order", path: "name")
  orderAdvertiser(input: OrderAdvertiserMutationInput!): Order! @requiresAuth @setAndUpdate(modelName: "order", path: "advertiserId")
}

type Order implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  fullName: String!
  advertiser: Advertiser! @refOne(modelName: "advertiser", localField: "advertiserId", foreignField: "_id")
  lineitems(input: OrderLineItemsInput = {}): LineItemConnection! @refMany(modelName: "lineitem", localField: "_id", foreignField: "orderId")
}

type OrderConnection {
  totalCount: Int!
  edges: [OrderEdge]!
  pageInfo: PageInfo!
}

type OrderEdge {
  node: Order!
  cursor: String!
}

enum OrderSortField {
  id
  name
  advertiserName
  createdAt
  updatedAt
}

input CreateOrderMutationInput {
  name: String!
  advertiserId: ObjectID!
}

input UpdateOrderMutationInput {
  id: ObjectID!
  payload: UpdateOrderPayloadInput!
}

input DeleteOrderMutationInput {
  id: ObjectID!
}

input UpdateOrderPayloadInput {
  name: String!
  advertiserId: ObjectID!
}

input OrderQueryInput {
  id: ObjectID!
}

input OrdersQueryInput {
  sort: OrderSortInput = {}
  pagination: PaginationInput = {}
}

input OrderSortInput {
  field: OrderSortField = id
  order: SortOrder = desc
}

input OrderNameMutationInput {
  id: ObjectID!
  value: String!
}

input OrderAdvertiserMutationInput {
  id: ObjectID!
  value: ObjectID!
}

input MatchOrdersQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input OrdersForAdvertiserQueryInput {
  advertiserId: ObjectID!
  sort: OrderSortInput = {}
  pagination: PaginationInput = {}
}

input MatchOrdersForAdvertiserQueryInput {
  advertiserId: ObjectID!
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input OrderLineItemsInput {
  sort: OrderSortInput = {}
  pagination: PaginationInput = {}
}

`;
