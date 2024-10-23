import React from "react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export function Task({ task }) {
  return (
    <div className="draggable bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold">{task.props.task.title}</h3>
      <p className="text-sm text-gray-600">{task.props.task.dueDate}</p>
    </div>
  );
}

export default function SortableItem(props) {
  const { id, task } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Task task={task} />
    </div>
  );
}
