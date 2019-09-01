import ApolloClient from "apollo-boost";
import dotenv from "dotenv";

dotenv.config();

const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URL
});

export default client;
