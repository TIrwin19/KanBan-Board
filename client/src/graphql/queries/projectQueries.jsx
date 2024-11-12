import { gql } from "@apollo/client";

export const GET_ADMIN_PROJECT = gql`
  query GetAdminProject($adminId: ID!) {
    getAdminProject(adminId: $adminId) {
      id
      title
      columns {
        title
        tasks {
          order
        }
      }
      admin {
        username
        id
      }
      members {
        id
        username
        avatar
      }
      createdAt
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

export const GET_PROJECT = gql`
  query GetProject($projectId: ID!) {
    getProject(projectId: $projectId) {
      title
      admin {
        id
      }
      columns {
        order
        tasks {
          id
          title
          order
          dueDate
        }
      }
    }
  }
`;
