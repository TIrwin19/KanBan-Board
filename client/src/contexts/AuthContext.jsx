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
  const [loadingState, setLoadingState] = useState(true); // Track overall loading state
  const [user, setUser] = useState(null); // Store user info in state

  // Use the getUser query
  const { data, loading, error } = useQuery(GET_USER, {
    fetchPolicy: "no-cache", // Prevent caching to always get fresh data
  });

  // Effect to handle changes in user data after query finishes
  useEffect(() => {
    if (loading) {
      setLoadingState(true); // Set loading state to true when fetching
      return;
    }

    if (error) {
      console.error("Error checking user session:", error);
      setUser(null); // If error, clear user state
      setLoadingState(false); // Finished loading
      return;
    }

    if (data?.getUser) {
      setUser(data.getUser); // Set the user if found
    } else {
      setUser(null); // Clear user if not found
    }

    setLoadingState(false); // Set loading to false once done
  }, [data, loading, error]);

  // Function to log the user in (server handles setting the token in HttpOnly cookie)
  const login = () => {
    console.log("User logged in");
    // No need to manage token here as it's in an HttpOnly cookie
    client.refetchQueries({ include: [GET_USER] }); // Refetch user data on login
  };

  // Function to log the user out (clear session)
  const logout = async () => {
    setUser(null); // Clear the user state locally
    await client.clearStore(); // Clear Apollo cache
    console.log("User logged out");
    //refresh the page to clear the cache
    window.location.reload();
  };

  // Check if the user is authenticated by verifying the user state
  const isAuthenticated = () => {
    if (loadingState) return false; // Return false if still loading
    return !!user; // Return true if user exists, false otherwise
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading: loadingState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
