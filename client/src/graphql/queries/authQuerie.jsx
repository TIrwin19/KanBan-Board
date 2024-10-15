import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      username
      email
    }
  }
`;

export const GET_USER_AVATAR = gql`
  query GetUserAvatar($userId: ID!) {
    getUserAvatar(userId: $userId)
  }
`;
