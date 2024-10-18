import React from "react";
import { useDraggable } from "@dnd-kit/core";

const Draggable = ({ id, data, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
        id,
        data,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
            {children}
        </div>
    );
};

export default Draggable;