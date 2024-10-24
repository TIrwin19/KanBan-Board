import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $columnId: ID!
    $title: String!
    $order: String!
    $dueDate: String!
  ) {
    createTask(
      projectId: $projectId
      columnId: $columnId
      title: $title
      order: $order
      dueDate: $dueDate
    ) 
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
