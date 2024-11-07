import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // Import the Auth context

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Get authentication status and loading state

  // While authentication is being fetched, show a loading spinner or null
  if (isAuthenticated() === null) {
    return <div>Loading...</div>; // Or show a spinner/loader component
  }

  // Once the loading is complete, if user is not authenticated, redirect
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />; // Redirect to the login page if not authenticated
  }

  return children; // Render the protected component if authenticated
};
export default ProtectedRoute;
