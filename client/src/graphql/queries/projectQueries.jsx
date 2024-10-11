import { gql } from "@apollo/client";

export const GET_ADMIN_PROJECT = gql`
  query GetAdminProject($adminId: ID!) {
    getAdminProject(adminId: $adminId) {
      id
      title
      admin {
        username
      }
    }
  }
`;
