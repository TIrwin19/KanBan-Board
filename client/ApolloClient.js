import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  gql,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { ApolloLink, Observable } from "@apollo/client";

let accessToken = null; // Token stored in memory

// Auth link to attach access token to headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

// GraphQL mutation for refreshing the access token
const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshAccessToken {
      accessToken
    }
  }
`;

// Error handling link to check for token expiration and refresh if needed
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.message === "UNAUTHENTICATED") {
        // If we get an unauthenticated error, try to refresh the token
        return new Observable(observer => {
          // Call the refresh token mutation
          client
            .mutate({ mutation: REFRESH_TOKEN_MUTATION })
            .then(({ data }) => {
              const newAccessToken = data?.refreshAccessToken?.accessToken;
              if (newAccessToken) {
                // Update the in-memory access token
                accessToken = newAccessToken;

                // Retry the failed request with the new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                });

                // Retry the request
                return forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              }
            })
            .catch(err => {
              // Handle error when refreshing the token fails
              observer.error(err);
            });
        });
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// Combine the authLink and errorLink with the httpLink
const link = ApolloLink.from([authLink, errorLink, httpLink]);

// Apollo Client setup
const client = new ApolloClient({
  link,
  credentials: "include", // Include cookies (refresh token) with every request
  cache: new InMemoryCache(),
});

export default client;
