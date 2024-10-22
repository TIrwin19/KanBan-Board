import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Droppable from "../Drop-Drag/Droppable.jsx";
import Task from "../Task/index.jsx";

const Column = ({ columnId, title, tasks = [] }) => {
  return (
    // <Droppable id={columnId}>
    <div className="bg-gray-100 w-80 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <Task key={task.id} task={task} index={index} columnId={columnId} />
        ))}
      </div>
    </div>
    // </Droppable>
  );
};

export default Column;
