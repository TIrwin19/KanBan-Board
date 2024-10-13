import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      user {
        username
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      accessToken
      user {
        username
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken {
    refreshAccessToken {
      accessToken
      user {
        username
      }
    }
  }
`;

export const SET_AVATAR = gql`
  mutation setAvatar($userId: ID!, $avatar: String!) {
    setAvatar(userId: $userId, avatar: $avatar)
  }
`;

