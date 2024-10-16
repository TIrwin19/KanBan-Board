import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Task from "../Task/index.jsx";
import { v4 as uuidv4 } from "uuid";
import TaskModal from "../Task/TaskModal.jsx";

const Column = ({ column, moveTask, tasks }) => {
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility

  const handleAddTask = (newTask) => {
    // Create a new task object with a unique ID
    const taskWithId = { id: uuidv4(), ...newTask };
    // Logic to add the new task to the tasks array
    // You may want to use a function to update the parent state here.
    tasks.push(taskWithId); // Update tasks array with new task (adjust according to your state management)
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item, monitor) => {
      const { id: draggedTaskId } = item;
      const { id: targetColumnId } = column;

      // Prevent duplication when dropping in the same column
      if (targetColumnId === monitor.getItem().columnId) {
        return; // Do nothing if it's the same column
      }

      // Call moveTask if the target column is different
      moveTask(draggedTaskId, targetColumnId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`column border rounded-lg p-4 ${isOver ? 'bg-gray-200' : 'bg-white'}`}>
      <h3 className="font-bold text-lg mb-2">{column.title}</h3>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
      >
        Add Task
      </button>
      <div className="tasks space-y-2">
        {tasks.map((task, index) => (
          <Task
            key={task.id} // Ensure task.id is unique
            task={task} // Pass the whole task object
            index={index} // Pass the index for drag-and-drop functionality
            columnId={column.id} // Pass the column ID for reference during drag-and-drop
          />
        ))}
      </div>

      {/* Task Modal for adding new tasks */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        addTask={handleAddTask} // Pass the addTask function here
        columnId={column.id} // Pass the column ID if necessary
      />
    </div>
  );
};

export default Column;