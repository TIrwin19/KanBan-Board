import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectPage from "./graphql/ProjectPage";
// import KanbanBoard from "./pages/test";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard"
import { useAuth } from "./contexts/AuthContext";
import { useMutation } from "@apollo/client"
import { REFRESH_ACCESS_TOKEN } from "./graphql/mutations/authMutations"

function App() {
  const { accessToken, setAccessToken } = useAuth()
   const [refreshToken] = useMutation(REFRESH_ACCESS_TOKEN);

   useEffect(() => {
    const fetchNewAccessToken = async () => {
      try {
        const { data } = await refreshToken();  // Call the backend to refresh the access token
        if (data && data.refreshToken) {
          setAccessToken(data.refreshToken.accessToken); // Update the access token in memory
        }
      } catch (error) {
        console.error("Error refreshing access token", error);
      }
    };

    fetchNewAccessToken();  // This will run when the component mounts (on page load)
  }, [refreshToken, setAccessToken]);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {accessToken ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          < Route path="*" element={<Landing />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
