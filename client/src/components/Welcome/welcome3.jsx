import { CREATE_PROJECT } from "../../graphql/mutations/projectMutations";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@apollo/client";

const Welcome3 = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [createProject] = useMutation(CREATE_PROJECT, {
    onCompleted: (data) => {
      console.log("Project created", data);
      setIsCreating(false);
      setProjectName("");
    },
  });

  const handleCreateProjectClick = () => {
    setIsCreating(true);
  };

  const handleCreateProject = () => {
    if (projectName.trim() !== "") {
      createProject({
        variables: {
          title: projectName,
          admin: user.id,
        },
      });
    }
  };

  return (
    <>
      {isCreating ? (
        <div className="flex items-center gap-2 animate-slide-in">
          <input
            type="text"
            placeholder="Enter project title"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-3 py-2 rounded-md text-gray-900 outline-none transition-all duration-300 ease-in-out"
          />
          <button
            onClick={handleCreateProject}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 ease-in-out"
          >
            Submit
          </button>
        </div>
      ) : (
        <button
          onClick={handleCreateProjectClick}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 ease-in-out"
        >
          Create Project
        </button>
      )}
    </>
  );
};

export default Welcome3;
