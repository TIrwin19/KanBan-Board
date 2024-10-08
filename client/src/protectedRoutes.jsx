import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // Import the Auth context

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Check if user is authenticated

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />; // Redirect to the landing page if not authenticated
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
