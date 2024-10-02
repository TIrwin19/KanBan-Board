import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "./contexts/AuthContext";

import client from "../ApolloClient.js"; // Import the client from the file you just created
import "./index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ApolloProvider client={client}>
      <StrictMode>
        <App />
      </StrictMode>
    </ApolloProvider>
  </AuthProvider>
);
