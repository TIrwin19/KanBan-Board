import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../../graphql/queries/projectQueries.jsx";
import { useStore } from "../../contexts/ProjectContext.jsx";

import Column from "./index.jsx";
import TaskModal from "../Task/TaskModal.jsx";
import Droppable from "../Drop-Drag/Droppable.jsx";
import Task from "../Task/index.jsx";
import Draggable from "../Drop-Drag/Draggable.jsx";

const Board = () => {
  const [columns, setColumns] = useState({
    column1: {
      title: "To Do",
      order: "column1",
      tasks: [],
    },
    column2: { title: "In Progress", order: "column2", tasks: [] },
    column3: { title: "Done", order: "column3", tasks: [] },
  });
  const [isModalOpen, setModalOpen] = useState(false);

  const { state } = useStore();

  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: {
      projectId: state.projectId,
    },
    pollInterval: 1000,
  });

  useEffect(() => {
    if (data) {
      const tasks = data.getTasks;

      // Update columns with fetched tasks
      const updatedColumns = { ...columns };
      tasks.forEach((column) => {
        const columnId = column.order; // Assuming `order` represents the column ID
        if (!updatedColumns[columnId]) {
          updatedColumns[columnId] = { title: column.title, tasks: [] };
        }
        updatedColumns[columnId].tasks = column.tasks;
      });

      setColumns(updatedColumns);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex">
      {Object.keys(columns).map((columnId) => (
        <div className="bg-gray-100 w-80 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            {columns[columnId].title}
          </h2>
          <div className="space-y-2">
            {columns[columnId].tasks.map((task, index) => (
              <Task
                key={`${task.id}-${index}`}
                task={task}
                columnId={columnId}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Task
      </button>
      {isModalOpen && (
        <TaskModal
          columns={Object.values(columns).map((column) => ({
            ...column,
            id: column.order,
          }))} // Convert columns object to array
          isOpen={isModalOpen}
          setIsOpen={setModalOpen}
        />
      )}
    </div>
  );
};

export default Board;
