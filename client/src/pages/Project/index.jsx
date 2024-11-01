import React, { useState, useEffect } from "react";
import NewBoard from "../../components/Column/newBoard.jsx";
import AddMembers from "../../components/AddMembers/index.jsx";

const Project = () => {
  return (
    <>
      <AddMembers />

      <NewBoard />
    </>
  );
};

export default Project;
