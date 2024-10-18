import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';


const TaskModal = ({ addTask, columns, isOpen, setIsOpen }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(columns[0]?.id || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && dueDate && selectedColumn) {
      addTask(title, dueDate, selectedColumn);
      setTitle("");
      setDueDate("");
      setSelectedColumn(columns[0]?.id || "");
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Column</label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-500 text-white p-2 rounded mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;