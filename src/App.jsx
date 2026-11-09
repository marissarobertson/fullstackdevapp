import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import PropTypes from "prop-types";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider } from "@apollo/client/react/index.js";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client/core/index.js";
import { setContext } from "@apollo/client/link/context/index.js";

const queryClient = new QueryClient();

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: { ...headers, ...(token && { Authorization: `Bearer ${token}` }) },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(
    new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL }),
  ),
  cache: new InMemoryCache(),
});

export function App({ children }) {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  );
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};
