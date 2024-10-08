import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// Your GraphQL server endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include", // Necessary for cookies (both access and refresh tokens)
});

// Middleware to set authorization header for requests
const authLink = setContext((_, { headers }) => {
  // Since we're using HttpOnly cookies, we don't need to read accessToken from localStorage
  return {
    headers: {
      ...headers,
      authorization: "" // Leave authorization empty; cookies will handle it
    },
  };
});

// Error handling link for token refreshing
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions.code === "UNAUTHENTICATED") {
        // If token expired, request a new access token using refresh token
        return fetch("http://localhost:4000/graphql", {
          method: "POST",
          credentials: "include", // This sends the refresh token cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation {
                refreshAccessToken {
                  accessToken
                }
              }
            `,
          }),
        })
          .then((response) => response.json())
          .then(({ data }) => {
            const newAccessToken = data.refreshAccessToken.accessToken;

            // Retry the failed request with the new token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newAccessToken}`, // You can still use this if needed
              },
            });

            return forward(operation);
          });
      }
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;