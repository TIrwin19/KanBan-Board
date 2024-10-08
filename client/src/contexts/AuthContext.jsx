import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { GET_USER } from "../graphql/queries/authQuerie";

// Create a context for Auth
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const client = useApolloClient(); // Apollo client to perform queries
  const [accessToken, setAccessToken] = useState(null); // Store accessToken in state

  // Use the getUser query
  const { data, loading, error } = useQuery(GET_USER, {
    fetchPolicy: "no-cache", // Prevent caching to always get fresh data
    skip: !client, // Skip the query until the client is ready
  });

  // Function to log the user in (not using token directly since it's in HttpOnly cookie)
  const login = (token) => {
    setAccessToken(token); // Optional: This might not be necessary since we won't directly access the token
    console.log("User logged in"); // Simplified logging
  };

  // Function to log the user out (clear the access token)
  const logout = () => {
    setAccessToken(null); // Clear the token
    console.log("User logged out");

    // Optionally make a request to your logout endpoint to clear server-side session
    // await logoutUser();
  };

  // Check if the user is authenticated by verifying the token
  const isAuthenticated = () => {
    if (!accessToken) return false;

    try {
      const decodedToken = jwtDecode(accessToken);
      // Check if token is expired (optional depending on token structure)
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };

  // Effect to update the accessToken based on the cookie status
  useEffect(() => {
    // Logic to check for the access token could be handled server-side
    const checkAccessToken = async () => {
      // Optionally, fetch the user info or check token validity here
      // if token is valid, you can set it with setAccessToken()
    };

    checkAccessToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
