//NEED REVIEW, NOT DONE

const gql = String.raw

const typedefs = gql`
type User {
  id: ID!
  username: String!
  email: String
}

type Column {
  id: ID!
  title: String!
  order: Int!
  tasks: [Task!]!

}

type Task {
 id: ID!
 title: String!
 description: String!
 status: Boolean!
 date: String!
 order: Int!
 user: [User!]!
 column: [Column!]!
}

type Query {
  authenticate: User!
  getUser: User!
  columns: [Column!]!
  column(id: ID!): Column
  tasks(columnId: ID!): [Task!]!
}

type Mutation {
  createColumn(title: String!, order: Int!): Column!
  updateColumn(id: ID!, title: String): Column!
  deleteColumn(id: ID!): Boolean!

  createTask(title: String!, description: String, order: Int!, columnId: ID!): Task!
  updateTask(id: ID!, title: String, description: String, order: Int!, columnId: ID!): Task!
  deleteTask(id: ID!): Boolean

  moveTask(taskId: ID!, columnId: ID!, order: Int!): Task!
}
`

module.exports = typedefs