import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../../graphql/queries/projectQueries.jsx";
import { useStore } from "../../contexts/ProjectContext.jsx";
import { DndContext, closestCenter, closestCorners } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "./index.jsx";
import TaskModal from "../Task/TaskModal.jsx";
import Droppable from "../Drop-Drag/Droppable.jsx";
import Task from "../Task/index.jsx";

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
      console.log(tasks);
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const { id: activeId } = active;
    const { id: overId } = over;

    if (activeId !== overId) {
      let activeColumnId, overColumnId;
      let activeIndex, overIndex;

      Object.keys(columns).forEach((columnId) => {
        const activeTaskIndex = columns[columnId].tasks.findIndex(
          (task) => task.id === activeId
        );
        if (activeTaskIndex !== -1) {
          activeColumnId = columnId;
          activeIndex = activeTaskIndex;
        }

        const overTaskIndex = columns[columnId].tasks.findIndex(
          (task) => task.id === overId
        );
        if (overTaskIndex !== -1) {
          overColumnId = columnId;
          overIndex = overTaskIndex;
        }
      });

      if (activeColumnId && overColumnId) {
        const activeTask = columns[activeColumnId].tasks[activeIndex];
        const updatedColumns = { ...columns };

        // Remove task from the active column
        updatedColumns[activeColumnId].tasks.splice(activeIndex, 1);

        // Add task to the over column
        updatedColumns[overColumnId].tasks.splice(overIndex, 0, activeTask);

        setColumns(updatedColumns);
      } else if (activeColumnId && !overColumnId) {
        setColumns((prevColumns) => {
          const newColumns = { ...prevColumns };
          const [movedTask] = newColumns[activeColumnId].tasks.splice(
            activeIndex,
            1
          );
          newColumns[overId].tasks.push(movedTask);
          return newColumns;
        });
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        {Object.keys(columns).map((columnId) => (
          <Droppable key={columnId} id={columnId}>
            <div className="bg-gray-100 w-80 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                {columns[columnId].title}
              </h2>
              <div className="space-y-2">
                {columns[columnId].tasks.map((task) => (
                  <Task key={task.id} task={task} columnId={columnId} />
                ))}
              </div>
            </div>
          </Droppable>
        ))}
      </DndContext>
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
