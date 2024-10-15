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
    // If moving within the same column and targetIndex is not provided, do nothing
    if (sourceColumnId === targetColumnId && targetIndex === null) return;

    // Get the source and target columns
    const sourceColumn = data.columns[sourceColumnId];
    const targetColumn = data.columns[targetColumnId];

    // Remove the task from the source column
    const updatedSourceTaskIds = [...sourceColumn.taskIds];
    const taskIndexInSource = updatedSourceTaskIds.indexOf(taskId);
    if (taskIndexInSource > -1) {
      updatedSourceTaskIds.splice(taskIndexInSource, 1);
    }

    // Insert the task in the target column at the specified index or at the end
    const updatedTargetTaskIds = [...targetColumn.taskIds];
    if (targetIndex !== null) {
      updatedTargetTaskIds.splice(targetIndex, 0, taskId);
    } else {
      updatedTargetTaskIds.push(taskId);
    }

    // Update state with the new columns
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
      content: `${taskName} (Due: ${dueDate})`,
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
