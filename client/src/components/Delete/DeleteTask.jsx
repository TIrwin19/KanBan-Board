import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/ProjectContext";
import { GET_PROJECT } from "../../graphql/queries/projectQueries";
import { TrashIcon } from "@heroicons/react/outline";
// import { DELETE_TASK } from "../../graphql/mutations/taskMutations";

const DeleteTask = ({ taskOrder, columnOrder }) => {
  const { user } = useAuth();
  const { state } = useStore();

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: {
      projectId: state.projectId,
    },
  });

  const admin = data?.getProject.admin.id;

  const [deleteTask] = useMutation(DELETE_TASK, {
    variables: {
      projectId: state.projectId,
      taskOrder: taskOrder,
      columnOrder: columnOrder,
    },
  });

  const handleDeleteTask = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {admin === user.id ? (
        <button
          onClick={handleDeleteTask}
          className="p-1 h-fit bg-red-600 text-white rounded-lg text-xl"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      ) : (
        ""
      )}
    </>
  );
};

export default DeleteTask;
