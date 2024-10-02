import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectPage from "./graphql/ProjectPage";
// import KanbanBoard from "./pages/test";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard"
import { useAuth } from "./contexts/AuthContext";



function App() {
  const { accessToken } = useAuth()
  console.log('is this an accessToken:', accessToken)
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
