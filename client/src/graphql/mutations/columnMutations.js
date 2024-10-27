import { gql } from "@apollo/client";

export const UPDATE_PROJECT_COLUMNS = gql`
  mutation UpdateProjectColumns($projectId: ID!, $columns: [UpdateColumnInput!]!) {
    updateProjectColumns(projectId: $projectId, columns: $columns) 
  }
`;
