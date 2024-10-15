import React, { useState, useEffect } from "react";

import Board from "../../components/Column/Board.jsx";
import AddMembers from "../../components/AddMembers/index.jsx";

const Project = () => {
  const [state, setState] = useState();

  useEffect(() => {
    // Side effect logic here

    return () => {
      // Cleanup logic here
    };
  }, []); // Dependency array can be empty or include specific states to watch

  return (
    <>
      <AddMembers />
      <Board />
    </>
  );
};

export default Project;
