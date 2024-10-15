import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ApolloProvider } from "@apollo/client";
import client from "../ApolloClient.js"; // Import the client from the file you just created
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectStateProvider } from "./contexts/ProjectContext.jsx";

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <AuthProvider>
        <ProjectStateProvider>
          <App />
        </ProjectStateProvider>
      </AuthProvider>
    </StrictMode>
  </ApolloProvider>
);
