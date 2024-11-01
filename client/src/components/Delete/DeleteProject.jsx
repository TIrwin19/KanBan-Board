import React from "react";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT } from "../../graphql/mutations/projectMutations";
import { useAuth } from "../../contexts/AuthContext";
import { XIcon } from "@heroicons/react/outline";

const DeleteProject = ({ admin, projectId }) => {
  const { user } = useAuth();

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    variables: {
      projectId: projectId,
      adminId: admin,
    },
  });

  const handleDeleteProject = (e) => {
    e.preventDefault();
    deleteProject();
  };

  return (
    <>
      {admin === user.id ? (
        <button
          onClick={handleDeleteProject}
          className="p-1 h-fit bg-red-600 text-white rounded-lg text-xl"
        >
          <XIcon className="w-4 h-4" />
        </button>
      ) : (
        ""
      )}
    </>
  );
};

export default DeleteProject;
