const gql = require('graphql-tag');

module.exports = gql`

extend type Mutation {
  createUser(input: CreateUserMutationInput!): User! @requiresAuth(role: Admin)
  loginUser(input: LoginUserMutationInput!): Authentication
}

enum UserRole {
  Admin
  Member
}

type Authentication {
  user: User!
  session: Session!
}

type Session {
  id: String!
  uid: String!
  cre: Int!
  exp: Int!
  token: String!
}

type User implements Timestampable @applyInterfaceFields {
  id: ObjectID!
  email: String!
  role: UserRole!
  givenName: String
  familyName: String
  logins: Int
  photoURL: String
}

input CreateUserMutationInput {
  email: String!
  password: String!
  confirmPassword: String!
  givenName: String!
  familyName: String!
  role: UserRole = Member
}

input LoginUserMutationInput {
  email: String!
  password: String!
}

`;
