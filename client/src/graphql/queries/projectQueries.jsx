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

export const GET_JOINED_PROJECT = gql`
  query GetJoinedProject($userId: ID!) {
    getJoinedProject(userId: $userId) {
      id
      title
      members {
        username
      }
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID!) {
    getTasks(projectId: $projectId) {
      order
      title
      tasks {
        title
        dueDate
        order
      }
    }
  }
`;
