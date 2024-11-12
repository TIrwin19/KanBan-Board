import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROJECT } from "../../graphql/queries/projectQueries";
import { useStore } from "../../contexts/ProjectContext";
import { DELETE_TASKS } from "../../graphql/mutations/taskMutations";

const DeleteTaskModal = ({ isOpen, setIsOpen }) => {
  const { state } = useStore();
  const projectId = state.projectId;
  const [selectedTasks, setSelectedTasks] = useState([]);
  const modalRef = useRef(null); // Reference for the modal content

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { projectId },
    pollInterval: 1000,
  });

  const [deleteTasks] = useMutation(DELETE_TASKS, {
    refetchQueries: [{ query: GET_PROJECT, variables: { projectId } }],
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false); // Close modal if click is outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns = data?.getProject?.columns || [];
  const allTasks = columns.flatMap((column) =>
    column.tasks.map((task) => ({ ...task, columnId: column._id }))
  );

  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleDeleteTasks = async () => {
    try {
      await deleteTasks({ variables: { projectId, taskIds: selectedTasks } });
      setSelectedTasks([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <div>
          {allTasks.length > 0 ? (
            allTasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center border-t-2"
              >
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task.id)}
                  onChange={() => handleCheckboxChange(task.id)}
                />
                <p>{task.title}</p>
                <p>{task.dueDate}</p>
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteTasks}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
