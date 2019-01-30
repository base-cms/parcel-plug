const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  report(input: ReportQueryInput!): Report! @requiresAuth
}

type Report {
  rows: [ReportRow!]
}

type ReportRow {
  advertiser: Advertiser!
  order: Order!
  lineitem: LineItem!
  ad: Ad!
  publisher: Publisher!
  deployment: Deployment!
  adunit: AdUnit!
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
