import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($title: String!, $admin: ID!) {
    createProject(title: $title, admin: $admin) {
      title
      admin {
        id
      }
      # members
      # id
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

export const ADD_MEMBERS = gql`
  mutation AddMembers($projectId: ID!, $adminId: ID!, $userEmail: String!) {
  addMembers(projectId: $projectId, adminId: $adminId, userEmail: $userEmail)
}
`