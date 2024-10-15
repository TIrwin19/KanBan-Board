import React from "react";
import { useDrag, useDrop } from "react-dnd";

const Task = ({ task, index, moveTask, columnId }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: "task",
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the item's height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Perform the move
      moveTask(dragIndex, hoverIndex, columnId);

      // Update the index of the dragged item
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id, index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-2 mb-2 bg-white rounded shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <p>{task.name}</p>
      <p className="text-sm text-gray-500">{task.dueDate}</p>
    </div>
  );
};

export default Task;
