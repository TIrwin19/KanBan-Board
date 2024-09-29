import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $columnId: ID!
    $title: String!
    $description: String!
    $order: Int!
    $user: ID
  ) {
    createTask(
      projectId: $projectId
      columnId: $columnId
      title: $title
      description: $description
      order: $order
      user: $user
    ) {
      date
      description
      id
      order
      status
      title
      user {
        username
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($projectId: ID!, $columnId: ID!, $taskId: ID!) {
    deleteTask(projectId: $projectId, columnId: $columnId, taskId: $taskId)
  }
`;

export const MOVE_TASK = gql`
  mutation MoveTask(
    $projectId: ID!
    $taskId: ID!
    $newColumnId: ID!
    $order: Int!
  ) {
    moveTask(
      projectId: $projectId
      taskId: $taskId
      newColumnId: $newColumnId
      order: $order
    ) {
      columns {
        id
      }
    }
  }
`;
