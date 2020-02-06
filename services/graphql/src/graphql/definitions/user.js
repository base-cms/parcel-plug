const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  checkSession(input: CheckSessionQueryInput!): Authentication
  user(input: UserQueryInput!): User @requiresAuth @retrieve(modelName: "user")
  users(input: UsersQueryInput = {}): UserConnection! @requiresAuth @retrieveMany(modelName: "user")
  matchUsers(input: MatchUsersQueryInput!): UserConnection! @requiresAuth @matchMany(modelName: "user")
}

extend type Mutation {
  createUser(input: CreateUserMutationInput!): User! @requiresAuth(role: Admin)
  loginUser(input: LoginUserMutationInput!): Authentication
  changeUserPassword(input: ChangeUserPasswordMutationInput!): User! @requiresAuth
  updateCurrentUserProfile(input: UpdateCurrentUserProfileMutationInput!): User! @requiresAuth
  deleteUser(input: DeleteUserMutationInput!): User! @requiresAuth(role: Admin) @delete(modelName: "user")

  userGivenName(input: UserGivenNameMutationInput!): User! @requiresAuth(role: Admin) @setAndUpdate(modelName: "user", path: "givenName")
  userFamilyName(input: UserFamilyNameMutationInput!): User! @requiresAuth(role: Admin) @setAndUpdate(modelName: "user", path: "familyName")
  userEmail(input: UserEmailMutationInput!): User! @requiresAuth(role: Admin) @setAndUpdate(modelName: "user", path: "email")
  userRole(input: UserRoleMutationInput!): User! @requiresAuth(role: Admin) @setAndUpdate(modelName: "user", path: "role")
}

enum UserRole {
  Admin
  Member
}

type UserConnection {
  totalCount: Int!
  edges: [UserEdge]!
  pageInfo: PageInfo!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserSortField {
  id
  givenName
  familyName
  createdAt
  updatedAt
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
  accountKey: String!
}

type User implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  email: String!
  role: UserRole!
  givenName: String
  familyName: String
  name: String
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

input DeleteUserMutationInput {
  id: ObjectID!
}


input UserQueryInput {
  id: ObjectID!
}

input UsersQueryInput {
  sort: UserSortInput = {}
  pagination: PaginationInput = {}
}

input MatchUsersQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input UserSortInput {
  field: UserSortField = id
  order: SortOrder = desc
}

input UserGivenNameMutationInput {
  id: ObjectID!
  value: String!
}

input UserFamilyNameMutationInput {
  id: ObjectID!
  value: String!
}

input UserEmailMutationInput {
  id: ObjectID!
  value: String!
}

input UserRoleMutationInput {
  id: ObjectID!
  value: UserRole!
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
