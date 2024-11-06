import React, { useState, useEffect } from "react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import DeleteTask from "../Delete/DeleteTask";

export function Task({ task }) {
  const [taskColor, setTaskColor] = useState("");

  const getTaskColor = (dueDate, columnId) => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDiff = dueDateObj - currentDate;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    console.log("columnOrder:", task?.columnId);

    if (columnId === "column3") {
      return "bg-white border-4 border-white";
    } else if (daysDiff <= 1) {
      return "border-4 border-red-500 bg-white";
    } else if (daysDiff <= 3) {
      return "border-4 border-yellow-500 bg-white";
    } else if (daysDiff > 7) {
      return "bg-white border-4 border-white";
    }
  };

  useEffect(() => {
    setTaskColor(getTaskColor(task?.dueDate, task?.columnId));
  }, [task?.dueDate, task?.columnId]);

  return (
    <div
      className={`${taskColor} draggable p-4 rounded-lg shadow-md flex justify-between `}
    >
      <h3 className="font-bold">{task?.title}</h3>
      <p className="text-sm text-gray-600">{task?.dueDate}</p>
    </div>
  );
}

export default function SortableItem(props) {
  const { id, task, columnId } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Task task={{ ...task, columnId }} />
    </div>
  );
}
