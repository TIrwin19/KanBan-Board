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
      items={tasks.map((task) => task.order) || []} // Use order as the item id
      strategy={verticalListSortingStrategy}
    >
      <div className="bg-gray-100 w-full md:w-1/3 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
        <div ref={setNodeRef} className="space-y-2 min-h-full min-w-full">
          {tasks.length === 0 ? (
            <div className="placeholder h-20 flex items-center justify-center text-gray-400">
              Drop tasks here
            </div>
          ) : (
            tasks.map((task, index) =>
              task ? (
                <SortableItem
                  key={`${task.order}-${index}`}
                  task={task}
                  id={task.order}
                  columnId={columnId}
                />
              ) : null
            )
          )}
        </div>
      </div>
    </SortableContext>
  );
};

export default Column;
