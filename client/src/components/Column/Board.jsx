import React, { useState } from "react";
import { DndContext, closestCenter, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./index.jsx";
import TaskModal from "../Task/TaskModal.jsx";
import Droppable from "../Drop-Drag/Droppable.jsx";

const Board = () => {
  const [columns, setColumns] = useState({
    column1: { title: "To Do", tasks: [{ id: "task1", title: "Task 1", dueDate: "2023-10-01" }] },
    column2: { title: "In Progress", tasks: [] },
    column3: { title: "Done", tasks: [] },
  });
  const [isModalOpen, setModalOpen] = useState(false);

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
        const activeTaskIndex = columns[columnId].tasks.findIndex((task) => task.id === activeId);
        if (activeTaskIndex !== -1) {
          activeColumnId = columnId;
          activeIndex = activeTaskIndex;
        }

        const overTaskIndex = columns[columnId].tasks.findIndex((task) => task.id === overId);
        if (overTaskIndex !== -1) {
          overColumnId = columnId;
          overIndex = overTaskIndex;
        }
      });

      if (activeColumnId && overColumnId) {
        setColumns((prevColumns) => {
          const newColumns = { ...prevColumns };
          const [movedTask] = newColumns[activeColumnId].tasks.splice(activeIndex, 1);
          newColumns[overColumnId].tasks.splice(overIndex, 0, movedTask);
          return newColumns;
        });
      } else if (activeColumnId && !overColumnId) {
        setColumns((prevColumns) => {
          const newColumns = { ...prevColumns };
          const [movedTask] = newColumns[activeColumnId].tasks.splice(activeIndex, 1);
          newColumns[overId].tasks.push(movedTask);
          return newColumns;
        });
      }
    }
  };

  const addTask = (newTask, columnId) => {
    if (!columns[columnId]) {
      console.error(`Column with id ${columnId} does not exist.`);
      return;
    }

    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask],
      },
    }));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
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