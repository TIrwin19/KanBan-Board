import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./index.jsx";
import TaskModal from "../Task/TaskModal.jsx";

const initialData = {
  columns: {
    1: { id: "1", title: "To Do", taskIds: ["1", "2"] },
    2: { id: "2", title: "In Progress", taskIds: [] },
    3: { id: "3", title: "Done", taskIds: ["3"] },
  },
  tasks: {
    1: { id: "1", content: "Task 1" },
    2: { id: "2", content: "Task 2" },
    3: { id: "3", content: "Task 3" },
  },
};

const Board = () => {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const moveTask = (taskId, sourceColumnId, targetColumnId, targetIndex) => {
    if (!sourceColumnId || !targetColumnId) {
      console.error("Column ID missing!");
      return;
    }

    const sourceColumn = data.columns[sourceColumnId];
    const targetColumn = data.columns[targetColumnId];

    // Check if columns are defined
    if (!sourceColumn || !targetColumn) {
      console.error("Source or target column is undefined");
      return;
    }

    const updatedSourceTaskIds = [...sourceColumn.taskIds];
    const taskIndexInSource = updatedSourceTaskIds.indexOf(taskId);
    if (taskIndexInSource > -1) {
      updatedSourceTaskIds.splice(taskIndexInSource, 1);
      if (sourceColumnId === targetColumnId && targetIndex !== null) {
        updatedSourceTaskIds.splice(targetIndex, 0, taskId); // Reordering within the same column
      }
    }

    const updatedTargetTaskIds = [...targetColumn.taskIds];
    if (targetIndex !== null) {
      updatedTargetTaskIds.splice(targetIndex, 0, taskId);
    } else {
      updatedTargetTaskIds.push(taskId);
    }

    setData((prevData) => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [sourceColumnId]: { ...sourceColumn, taskIds: updatedSourceTaskIds },
        [targetColumnId]: { ...targetColumn, taskIds: updatedTargetTaskIds },
      },
    }));
  };

  const addTask = (taskName, dueDate) => {
    const newTaskId = `${Date.now()}`;
    const newTask = {
      id: newTaskId,
      title: taskName, // Use separate properties for title and due date
      dueDate: dueDate,
    };

    const newColumn = {
      ...data.columns["1"],
      taskIds: [...data.columns["1"].taskIds, newTaskId],
    };

    setData((prevData) => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...prevData.columns,
        ["1"]: newColumn,
      },
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add Task
      </button>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={addTask}
      />

      <div className="grid grid-cols-3 gap-4 p-4">
        {Object.values(data.columns).map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={column.taskIds.map((taskId) => data.tasks[taskId])}
            moveTask={moveTask}
          />
        ))}
      </div>
    </DndProvider>
  );
};
export default Board;
