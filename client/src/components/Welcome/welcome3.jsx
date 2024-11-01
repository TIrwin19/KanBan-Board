import { CREATE_PROJECT } from "../../graphql/mutations/projectMutations";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { PlusIcon } from "@heroicons/react/outline";

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="size-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 4.5v15m7.5-7.5h-15"
  />
</svg>;

const Welcome3 = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [createProject] = useMutation(CREATE_PROJECT, {
    onCompleted: (data) => {
      // console.log("Project created", data);
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
          className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 ease-in-out"
        >
          <PlusIcon className="h-5 w-5" />
          Create Project
        </button>
      )}
    </>
  );
};

export default Welcome3;
