import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Droppable from "../Drop-Drag/Droppable.jsx";
// import Task from "../Task/index.jsx";
import SortableItem from "../Task/index.jsx";

const Column = (props) => {
  const { title, tasks, columnId } = props;
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <SortableContext
      id={columnId}
      items={tasks}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="bg-gray-100 w-80 p-4 rounded-lg shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <SortableItem
              key={`${task.id}-${index}`}
              task={task}
              id={task.id}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
};

export default Column;
