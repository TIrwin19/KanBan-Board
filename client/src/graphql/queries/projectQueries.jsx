import { gql } from "@apollo/client";

export const GET_PROJECT = gql`
  query GetProject($getProjectId: ID!) {
    getProject(id: $getProjectId) {
      title
      members {
        username
      }
      id
      columns {
        title

        tasks {
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

        order
        id
      }
    }
  }
`;
