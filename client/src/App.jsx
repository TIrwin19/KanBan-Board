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
import Project from "./pages/Project";
import ProjectList from "./pages/ProjectList";
import { useStore } from "./contexts/ProjectContext";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const { state } = useStore();

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
        <Route
          path={`/project/:${state.projectId}`}
          element={
            <ProtectedRoute>
              <Project />
            </ProtectedRoute>
          }
        />
        {/* ${user.id} breaks upon expired token REDO */}
        <Route
          path={`/projectlist/:userId`}
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
