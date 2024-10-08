import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectPage from "./graphql/ProjectPage";
// import KanbanBoard from "./pages/test";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./protectedRoutes";
import { useAuth } from "./contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { REFRESH_ACCESS_TOKEN } from "./graphql/mutations/authMutations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
