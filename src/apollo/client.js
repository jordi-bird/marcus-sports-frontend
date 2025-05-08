// src/apollo/client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql', // Canvia-ho si el backend fa servir un altre port
  }),
  cache: new InMemoryCache(),
});

export default client;
