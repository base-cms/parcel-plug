const gql = require('graphql-tag');

module.exports = gql`

type Mutation {
  createUser(input: CreateUserMutationInput!): User!
}

enum UserRole {
  Admin
  Member
}

type User {
  id: ObjectID!
  email: String!
  role: UserRole!
  deleted: Boolean!
  givenName: String
  familyName: String
  logins: Int
  photoURL: String
  createdAt: Date
  updatedAt: Date
}

input CreateUserMutationInput {
  email: String!
  password: String!
  confirmPassword: String!
  givenName: String!
  familyName: String!
  role: UserRole = Member
}

`;
