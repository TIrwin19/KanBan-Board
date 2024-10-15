import React from "react";

const Task = ({ item, index, draggableId, onDragEnd }) => {
  return (
    <Draggable draggableId={draggableId} index={index} onDragEnd={onDragEnd}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {item}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
