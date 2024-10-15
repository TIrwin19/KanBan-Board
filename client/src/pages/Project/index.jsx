import React, { useState, useEffect } from "react";

import Board from "../../components/Column/Board";

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
      <Board />
    </>
  );
};

export default Project;
