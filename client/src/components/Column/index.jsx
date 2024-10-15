import React from "react";
import { useDrag, useDrop } from "react-dnd";
import Task from "../Task/index.jsx";

const Column = ({ column, tasks, moveTask }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item) => {
      // If dropped into a different column, move the task
      if (item.columnId !== column.id) {
        moveTask(item.index, tasks.length, column.id); // Move to end of column
        item.columnId = column.id; // Update column id for the dragged item
      }
    },
  });

  return (
    <div
      ref={drop}
      className="bg-gray-100 p-4 rounded-lg min-h-[300px] flex flex-col"
    >
      <h2 className="font-bold mb-2">{column.title}</h2>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          columnId={column.id}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
};

export default Column;
