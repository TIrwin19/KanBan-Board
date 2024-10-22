import React from "react";
import Draggable from "../Drop-Drag/Draggable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const Task = ({ task, columnId }) => {
  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  //   isDragging,
  // } = useSortable({
  //   id: task.id,
  //   data: { columnId },
  // });

  // const style = {
  //   transform: transform
  //     ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
  //     : undefined,
  //   transition:
  //     transition ||
  //     "transform 100ms ease, box-shadow 100ms ease, opacity 100ms ease",
  //   zIndex: isDragging ? 999 : "auto",
  //   opacity: isDragging ? 0.9 : 1,
  //   boxShadow: isDragging
  //     ? "0 10px 20px rgba(0, 0, 0, 0.2)"
  //     : "0 1px 3px rgba(0, 0, 0, 0.1)",
  // };

  return (
    // <Draggable id={task.id} data={{ columnId }}>
    <div
      // ref={setNodeRef}
      // style={style}
      // {...attributes}
      // {...listeners}
      className="draggable bg-white p-4 rounded-lg shadow-md"
    >
      <h3 className="font-bold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.dueDate}</p>
    </div>
    // </Draggable>
  );
};

export default Task;
