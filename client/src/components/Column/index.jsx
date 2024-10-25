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

  tasks.map((task, index) => {
    console.log("task: ", task);
    console.log("index: ", index);
    console.log("taskId: ", task.id);
    console.log("taskOrder", task.order)
  }
  )

  return (
    <SortableContext
      id={columnId}
      items={tasks.map(task => task.order) || []} // Use order as the item id
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="bg-gray-100 w-80 p-4 rounded-lg shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
        <div className="space-y-2">
          {tasks && tasks.map((task, index) => (
            <SortableItem
              key={`${task.order}-${index}`}
              task={task}
              id={task.order}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
};

export default Column;
