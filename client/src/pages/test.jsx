import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Initial data for the columns and tasks
const initialColumns = {
  "column-1": { id: "column-1", title: "To Do", tasks: ["Task 1", "Task 2"] },
  "column-2": { id: "column-2", title: "In Progress", tasks: ["Task 3"] },
  "column-3": { id: "column-3", title: "Review", tasks: ["Task 4"] },
  "column-4": { id: "column-4", title: "Done", tasks: [] },
  "column-5": { id: "column-5", title: "Archived", tasks: [] },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no destination (dropped outside the droppable area), do nothing
    if (!destination) return;

    // Find the source and destination columns
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = [...destColumn.tasks];

    // Remove the task from the source column
    const [removedTask] = sourceTasks.splice(source.index, 1);

    // Add the task to the destination column
    destTasks.splice(destination.index, 0, removedTask);

    // Update the column state
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4">
        {Object.values(columns).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-800 rounded-lg shadow-md p-4 w-64"
              >
                <h2 className="font-bold text-lg mb-2 text-white">
                  {column.title}
                </h2>
                {column.tasks.map((task, index) => (
                  <Draggable
                    key={`${column.id}-${index}`} // Ensure unique key per task
                    draggableId={`${column.id}-${task}-${index}`} // Ensure unique draggableId
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-black rounded-lg shadow p-2 mb-2 cursor-pointer text-white"
                      >
                        {task}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
