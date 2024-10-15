import React, { useState } from "react";

import Task from "../Task";

// const GlobalStyle = styled.div`
//   @import "~react-beautiful-dnd/styles.css";
// `;

const Column = ({ id, name, items, onDragEnd }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 min-h-[300px]" draggable="false">
      <h2 className="font-bold mb-4">{name}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <Task
            key={index}
            item={item}
            index={index}
            draggableId={item}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
