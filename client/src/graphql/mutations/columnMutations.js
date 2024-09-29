import { gql } from "@apollo/client";

export const CREATE_COLUMN = gql`
  mutation CreateColumn($projectId: ID!, $title: String!, $order: Int!) {
    createColumn(projectId: $projectId, title: $title, order: $order) {
      title
      order
      id
    }
  }
`;

export const DELETE_COLUMN = gql`
  mutation DeleteColumn($projectId: ID!, $columnId: ID!) {
    deleteColumn(projectId: $projectId, columnId: $columnId)
  }
`;

export const UPDATE_COLUMN_ORDER = gql`
  mutation UpdateColumnOrder($projectId: ID!, $columnId: ID!, $newOrder: Int!) {
    updateColumnOrder(
      projectId: $projectId
      columnId: $columnId
      newOrder: $newOrder
    ) {
      columns {
        id
        order
      }
    }
  }
`;
