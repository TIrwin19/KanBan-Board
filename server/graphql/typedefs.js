//NEED REVIEW, NOT DONE

const gql = String.raw

const typeDefs = gql`
type User {
  id: ID!
  username: String!
  email: String
}

type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
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
  members: [ID!]!
  columns: [Column!]!
}

type Query {
  getUser: User!
  getProject(id: ID!): Project!
}

type Mutation {
  createProject(title: String!, members: [ID!]!): Project!
  deleteProject(projectId: ID!): Boolean!

  createColumn(projectId: ID!, title: String!, order: Int!): Column!
  deleteColumn(projectId: ID!, columnId: ID!): Boolean!
  updateColumnOrder(projectId: ID!, columnId: ID!, newOrder: Int!): Project!

  createTask(projectId: ID!, columnId: ID!, title: String!, description: String!, order: Int!, user: ID): Task!
  deleteTask(projectId: ID!, columnId: ID!, taskId: ID!): Boolean!
  moveTask(projectId: ID!, taskId: ID!, newColumnId: ID!, order: Int!): Project!

  register(username: String!, email: String!, password: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
  refreshAccessToken(refreshToken: String!): AccessTokenPayload!
  logout: Boolean!
}
`;

module.exports = typeDefs