import React, { useState } from "react";

const TaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(taskName, dueDate);
    setTaskName("");
    setDueDate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 p-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
