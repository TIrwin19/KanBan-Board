import React from "react";
import { useDrag, useDrop } from "react-dnd";

const Task = ({ task, index, columnId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, index, columnId }, // Ensure we're passing the necessary props
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="bg-white p-4 mb-2 rounded shadow"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <h4 className="font-bold">{task.title}</h4>
      <p>Due: {task.dueDate || 'Not set'}</p> {/* Ensure we display something if dueDate is missing */}
    </div>
  );
};

export default Task;
