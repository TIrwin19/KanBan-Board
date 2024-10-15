import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskModal = ({ isOpen, onClose, addItemToList, columns }) => {
  const [newItem, setNewItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addItemToList("todo", newItem);
    setNewItem("");
  };

  if (!isOpen) return null;

  const items = columns.map((col) => ({ id: col.id, name: col.name }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task description..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="border rounded p-2 w-full mb-4"
          />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="all">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Draggable
                    key="task-modal"
                    draggableId="task-modal"
                    index={0}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <select className="px-4 py-2 bg-gray-200 rounded">
                          {items.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4"
          >
            Add Task
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  );

  function handleDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(
      columns.find((c) => c.id === result.source.droppableId).items
    );
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === result.source.droppableId ? { ...column, items } : column
      )
    );
  }
};

export default TaskModal;
