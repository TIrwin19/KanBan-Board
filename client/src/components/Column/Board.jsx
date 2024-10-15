import React, { useState } from "react";
import Column from "./index.jsx";
import TaskModal from "../Task/TaskModal.jsx";

const initialColumns = [
  { id: "todo", name: "To Do", items: [] },
  { id: "inProgress", name: "In Progress", items: [] },
  { id: "done", name: "Done", items: [] },
];

const Board = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [showModal, setShowModal] = useState(false);

  const addItemToList = (listId, newItem) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === listId
          ? { ...column, items: [...column.items, newItem] }
          : column
      )
    );
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;

    const newColumns = Array.from(columns);
    const [reorderedItem] = newColumns[source.droppableId].items.splice(
      source.index,
      1
    );
    newColumns[destination.droppableId].items.splice(
      destination.index,
      0,
      reorderedItem
    );

    setColumns(newColumns);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-8"
      >
        Add Task
      </button>

      <TaskModal
        isOpen={showModal}
        onClose={closeModal}
        addItemToList={addItemToList}
        columns={columns}
      />

      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            name={column.name}
            items={column.items}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
