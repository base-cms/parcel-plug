const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  checkSession(input: CheckSessionQueryInput!): Authentication
}

extend type Mutation {
  createUser(input: CreateUserMutationInput!): User! @requiresAuth(role: Admin)
  loginUser(input: LoginUserMutationInput!): Authentication
  changeUserPassword(input: ChangeUserPasswordMutationInput!): User! @requiresAuth
  updateCurrentUserProfile(input: UpdateCurrentUserProfileMutationInput!): User! @requiresAuth
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

input CheckSessionQueryInput {
  token: String!
}

input ChangeUserPasswordMutationInput {
  id: ObjectID!
  value: String!
  confirm: String!
}

input UpdateCurrentUserProfileMutationInput {
  givenName: String!
  familyName: String!
}

`;
