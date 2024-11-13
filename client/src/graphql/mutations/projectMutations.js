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

export const ADD_MEMBERS = gql`
  mutation AddMembers($projectId: ID!, $adminId: ID!, $userEmail: String!) {
  addMembers(projectId: $projectId, adminId: $adminId, userEmail: $userEmail){
    color
    message
  }
}
`

export const EDIT_PROJECT = gql`
  mutation EditProject($projectId: ID!, $newName: String!) {
  editProject(projectId: $projectId, newName: $newName)
}
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!, $adminId: ID!) {
    deleteProject(projectId: $projectId, adminId: $adminId)
  }
`