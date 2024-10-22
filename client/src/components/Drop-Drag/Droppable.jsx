import React from "react";
import { useDroppable } from "@dnd-kit/core";

const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="droppable-container">
      {children}
    </div>
  );
};

export default Droppable;
