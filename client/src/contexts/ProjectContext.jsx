import { createContext, useContext, useState } from "react";

const ProjectId = createContext();
export const useStore = () => useContext(ProjectId);

export const ProjectStateProvider = ({ children }) => {
  const initialState = {
    projectId: "",
  };

  const [state, setState] = useState(initialState);

  const setProjectId = (newProjectId) => {
    setState((prevState) => ({
      ...prevState,
      projectId: newProjectId,
    }));
  };

  return (
    <ProjectId.Provider value={{ state, setState, setProjectId }}>
      {children}
    </ProjectId.Provider>
  );
};
