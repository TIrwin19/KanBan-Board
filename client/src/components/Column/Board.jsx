import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./index.jsx";
import TaskModal from "../Task/TaskModal.jsx";
import Droppable from "../Drop-Drag/Droppable.jsx";

const Board = () => {
  const [columns, setColumns] = useState({
    "column-1": {
      title: "To Do",
      tasks: [
        { id: 1, title: "Task 1", dueDate: "2024-10-17" },
        { id: 2, title: "Task 2", dueDate: "2024-10-18" },
      ],
    },
    "column-2": {
      title: "In Progress",
      tasks: [
        { id: 3, title: "Task 3", dueDate: "2024-10-19" },
        { id: 4, title: "Task 4", dueDate: "2024-10-20" },
      ],
    },
    "column-3": {
      title: "Done",
      tasks: [],
    },
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [taskIdCounter, setTaskIdCounter] = useState(5); // Initialize with the next available ID

  const addTask = (title, dueDate, columnId) => {
    const newTask = { id: taskIdCounter, title, dueDate };
    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask],
      },
    }));
    setTaskIdCounter(taskIdCounter + 1); // Increment the counter for the next task
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.data.current.columnId;
    const overColumnId = over.data.current.columnId;

    if (activeColumnId === overColumnId) {
      // Reorder within the same column
      const column = columns[activeColumnId];
      const oldIndex = column.tasks.findIndex((task) => task.id === active.id);
      const newIndex = column.tasks.findIndex((task) => task.id === over.id);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [activeColumnId]: {
          ...column,
          tasks: arrayMove(column.tasks, oldIndex, newIndex),
        },
      }));
    } else {
      // Move between columns
      const activeColumn = columns[activeColumnId];
      const overColumn = columns[overColumnId];
      const activeTask = activeColumn.tasks.find((task) => task.id === active.id);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [activeColumnId]: {
          ...activeColumn,
          tasks: activeColumn.tasks.filter((task) => task.id !== active.id),
        },
        [overColumnId]: {
          ...overColumn,
          tasks: [...overColumn.tasks, activeTask],
        },
      }));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <button onClick={() => setModalOpen(true)} className="bg-blue-500 p-2 rounded">
        Add Task
      </button>
      <div className="flex space-x-4 p-4">
        {Object.keys(columns).map((columnId) => (
          <SortableContext key={columnId} items={columns[columnId].tasks.map((task) => task.id)}>
            <Column columnId={columnId} title={columns[columnId].title} tasks={columns[columnId].tasks} />
          </SortableContext>
        ))}
        <TaskModal
          addTask={addTask}
          columns={Object.keys(columns).map((id) => ({
            id,
            title: columns[id].title,
          }))}
          isOpen={isModalOpen}
          setIsOpen={setModalOpen}
        />
      </div>
    </DndContext>
  );
};

export default Board;