//NEED REVIEW, NOT DONE

const gql = String.raw

const typedefs = gql`
type User {
  id: ID!
  username: String!
  email: String
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

type Project {
  id: ID!
  title: String!
  members: [ID!]!
  columns: [Column!]!
}

type Query {
  authenticate: User!
  getUser: User!
  getProject(id: ID!): Project!
}

type Mutation {
  createColumn(projectId: ID!, title: String!, order: Int!): Column!
  deleteColumn(projectId: ID!, columnId: ID!): Boolean!

  createTask(projectId: ID!, columnId: ID!, title: String!, description: String!, order: Int!, user: ID): Task!
  deleteTask(projectId: ID!, columnId: ID!, taskId: ID!): Boolean!
  moveTask(projectId: ID!, taskId: ID!, newColumnId: ID!, order: Int!): Project!

  # createColumn(title: String!, order: Int!): Column!
  # updateColumn(id: ID!, title: String): Column!
  # deleteColumn(id: ID!): Boolean!

  # createTask(title: String!, description: String, order: Int!, columnId: ID!): Task!
  # updateTask(id: ID!, title: String, description: String, order: Int!, columnId: ID!): Task!
  # deleteTask(id: ID!): Boolean

  # moveTask(taskId: ID!, columnId: ID!, order: Int!): Task!
}
`

module.exports = typedefs