const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  report(input: ReportQueryInput!): Report! @requiresAuth
}

type Report {
  rows: [ReportRow!]
}

type ReportRow {
  advertiser: Advertiser! @refOne(modelName: "advertiser", localField: "advertiserId", foreignField: "_id")
  order: Order! @refOne(modelName: "order", localField: "orderId", foreignField: "_id")
  lineitem: LineItem! @refOne(modelName: "lineitem", localField: "lineitemId", foreignField: "_id")
  ad: Ad! @refOne(modelName: "ad", localField: "adId", foreignField: "_id")
  publisher: Publisher! @refOne(modelName: "publisher", localField: "publisherId", foreignField: "_id")
  deployment: Deployment! @refOne(modelName: "deployment", localField: "deploymentId", foreignField: "_id")
  adunit: AdUnit! @refOne(modelName: "adunit", localField: "adunitId", foreignField: "_id")
  impressions: Int!
  clicks: Int!
  ctr: Float!
}

input ReportQueryInput {
  start: Date!
  end: Date!
  advertiserIds: [ObjectID!]
  orderIds: [ObjectID!]
  lineitemIds: [ObjectID!]
  adIds: [ObjectID!]
  publisherIds: [ObjectID!]
  deploymentIds: [ObjectID!]
  adunitIds: [ObjectID!]
}

`;
