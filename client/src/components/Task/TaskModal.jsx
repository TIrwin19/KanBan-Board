import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';


const TaskModal = ({ isOpen, onClose, addTask, columnId }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (taskTitle.trim() === '') {
      return; // Do not submit if task title is empty
    }

    // Create a task object to pass to the addTask function
    const newTask = {
      id: Date.now(), // Use a better unique ID generation method in production
      title: taskTitle,
      dueDate,
    };

    addTask(newTask, columnId); // Call the addTask function with the new task and column ID
    setTaskTitle(''); // Reset input field
    setDueDate('');
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null; // Do not render if the modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task Title"
            required
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
