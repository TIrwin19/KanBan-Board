import React from "react";
import Draggable from "../Drop-Drag/Draggable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";


const Task = ({ task, columnId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 777 : "auto",
    opacity: isDragging ? 0.2 : 2,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="draggable bg-white p-2 rounded shadow">
      <h3 className="font-bold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.dueDate}</p>
    </div>
  );
};

export default Task;