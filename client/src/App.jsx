import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectPage from "./graphql/ProjectPage";
// import KanbanBoard from "./pages/test";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard"



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
