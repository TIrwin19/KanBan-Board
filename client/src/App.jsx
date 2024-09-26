import React from "react";
import ProjectPage from "./graphql/ProjectPage";
import KanbanBoard from "./pages/test";

function App() {
  return (
    <div>
      <h1>My Project Management App</h1>
      <ProjectPage projectId="1" />
      <KanbanBoard />
      {/* Example project page */}
    </div>
  );
}

export default App;
