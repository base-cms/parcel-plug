const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  deployment(input: DeploymentQueryInput!): Deployment @requiresAuth
  deployments(input: DeploymentsQueryInput = {}): DeploymentConnection! @requiresAuth
}

extend type Mutation {
  createDeployment(input: CreateDeploymentMutationInput!): Deployment! @requiresAuth
  updateDeployment(input: UpdateDeploymentMutationInput!): Deployment! @requiresAuth
  deleteDeployment(input: DeleteDeploymentMutationInput!): Deployment! @requiresAuth
}

type Deployment implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  publisher: Publisher!
}

type DeploymentConnection {
  totalCount: Int!
  edges: [DeploymentEdge]!
  pageInfo: PageInfo!
}

type DeploymentEdge {
  node: Deployment!
  cursor: String!
}

enum DeploymentSortField {
  id
  name
  updatedAt
}

input CreateDeploymentMutationInput {
  name: String!
  publisherId: ObjectID!
}

input UpdateDeploymentMutationInput {
  id: ObjectID!
  payload: UpdateDeploymentPayloadInput!
}

input DeleteDeploymentMutationInput {
  id: ObjectID!
}

input UpdateDeploymentPayloadInput {
  name: String!
  publisherId: ObjectID!
}

input DeploymentQueryInput {
  id: ObjectID!
}

input DeploymentsQueryInput {
  sort: DeploymentSortInput = {}
  pagination: PaginationInput = {}
}

input DeploymentSortInput {
  field: DeploymentSortField = id
  order: SortOrder = desc
}

`;
