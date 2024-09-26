import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


//create an http link to connect to ur backend graphql server
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Your GraphQL server URL
  credentials: 'include', //this allows cookies to be sent with request, necessary for auth and session management
});


//create a middleware to add authentication headers to each request if needed
const authLink = setContext((_, { headers }) => {
  //retrieve the auth token from local storage if it exist 
  const token = localStorage.getItem('token');

  //return the headers to the context so httpLink can read them (with the auth token)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
