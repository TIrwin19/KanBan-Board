//NEED REVIEW, NOT DONE

const gql = String.raw

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
  }

  type AuthPayload {
    user: User!
    accessToken: String
    refreshToken: String
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    status: Boolean!
    date: String!
    order: Int!
    user: [User!]!
  }

  type Column {
    id: ID!
    title: String!
    order: Int!
    tasks: [Task!]!
  }

  type AccessTokenPayload {
    accessToken: String
  }

  type Project {
    id: ID!
    title: String!
    admin: User!
    members: [User!]!
    columns: [Column!]!
  }

  type AddMemberResponse {
    message: String!
    color: String!
  }

  type Query {
    getUser: User!
    getAdminProject(adminId: ID!): [Project!]!
    getJoinedProject(userId: ID!): [Project!]!
    getUserAvatar(userId: ID!): String!
  }

  type Mutation {
    createProject(title: String!, admin: ID!): Project!
    deleteProject(projectId: ID!): Boolean!
    addMembers(projectId: ID!, adminId: ID!, userEmail: String!): AddMemberResponse!

    createColumn(projectId: ID!, title: String!, order: Int!): Column!
    deleteColumn(projectId: ID!, columnId: ID!): Boolean!
    updateColumnOrder(projectId: ID!, columnId: ID!, newOrder: Int!): Project!

    createTask(
      projectId: ID!
      columnId: ID!
      title: String!
      description: String!
      order: Int!
      user: ID
    ): Task!
    deleteTask(projectId: ID!, columnId: ID!, taskId: ID!): Boolean!
    moveTask(
      projectId: ID!
      taskId: ID!
      newColumnId: ID!
      order: Int!
    ): Project!

    register(username: String!, email: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    refreshAccessToken(refreshToken: String!): AccessTokenPayload!
    logout: Boolean!

    setAvatar(userId: ID!, avatar: String!): Boolean
  }
`;

module.exports = typeDefs