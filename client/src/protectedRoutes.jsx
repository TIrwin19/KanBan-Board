import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { accessToken, loading } = useAuth();

  // Show loading state if we're still refreshing the token
  if (loading) {
    return <div>Loading...</div>; // Or some custom loading component
  }

  // If no accessToken, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
