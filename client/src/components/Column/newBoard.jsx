import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useStore } from "../../contexts/ProjectContext.jsx";

// Import the existing components
import Column from "./index.jsx";
import { Task } from "../Task/index.jsx";

import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../../graphql/queries/projectQueries.jsx";

const wrapperStyle = {
  display: "flex",
  flexDirection: "row",
};

const defaultAnnouncements = {
  onDragStart(id) {
    console.log(`Picked up draggable item ${id}.`);
  },
  onDragOver(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(`Draggable item ${id} is no longer over a droppable area.`);
  },
  onDragEnd(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`Draggable item ${id} was dropped.`);
  },
  onDragCancel(id) {
    console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
  },
};

export default function NewBoard() {
  const [columns, setColumns] = useState({
    column1: {
      title: "To Do",
      order: "column1",
      tasks: [{ id: "task1", title: "Task 1", dueDate: "2023-10-01" }],
    },
    column2: {
      title: "In Progress",
      order: "column2",
      tasks: [{ id: "task2", title: "Task 2", dueDate: "2023-10-02" }],
    },
    column3: {
      title: "Done",
      order: "column3",
      tasks: [{ id: "task3", title: "Task 3", dueDate: "2023-10-03" }],
    },
  });

  const [activeId, setActiveId] = useState();
  const [isModalOpen, setModalOpen] = useState(false);

  const { state } = useStore(); // Assuming you have a ProjectContext

  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: {
      projectId: state.projectId,
    },
    pollInterval: 1000,
  });

  useEffect(() => {
    if (data) {
      const tasks = data.getTasks;

      const updatedColumns = { ...columns };
      tasks.forEach((column) => {
        const columnId = column.order;
        console.log(column);
        console.log(columnId);
        if (!updatedColumns[columnId]) {
          updatedColumns[columnId] = { title: column.title, tasks: [] };
        }
        updatedColumns[columnId].tasks = column.tasks;
      });

      setColumns(updatedColumns);
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findTaskById(id) {
    for (const column of Object.values(columns)) {
      const task = column.tasks.find((task) => task.id === id);
      if (task) {
        return task;
      }
    }
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex space-x-4">
      <DndContext
        announcements={defaultAnnouncements}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.keys(columns).map((columnId) => (
          <Column
            key={columnId}
            title={columns[columnId].title}
            columnId={columnId}
            tasks={columns[columnId].tasks.map((task, index) => (
              <Task
                key={`${task.id}-${index}`}
                task={task}
                columnId={columnId}
              />
            ))}
          />
        ))}
        <DragOverlay>
          {activeId ? <Task task={findTaskById(activeId)} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    // Find the columns
    const activeColumn = findColumn(id);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    setColumns((prev) => {
      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];

      // Find the indexes for the items
      const activeIndex = activeItems.tasks.indexOf(id);
      const overIndex = overItems.tasks.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a column
        newIndex = overItems.tasks.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.tasks.length - 1 &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex =
          overIndex >= 0 ? overIndex + modifier : overItems.tasks.length + 1;
      }

      return {
        ...prev,
        [activeColumn]: [
          ...prev[activeColumn].tasks.filter((item) => item !== active.id),
        ],
        [overColumn]: [
          ...prev[overColumn].tasks.slice(0, newIndex),
          id,
          ...prev[overColumn].tasks.slice(
            newIndex,
            prev[overColumn].tasks.length
          ),
        ],
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id: activeId } = active;
    const { id: overId } = over;

    const activeColumn = findColumn(id);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return;
    }

    const activeIndex = columns[activeColumn].tasks.indexOf(activeId);
    const overIndex = columns[overColumn].tasks.indexOf(overId);

    if (activeIndex !== overIndex) {
      setColumns((columns) => ({
        ...columns,
        [overColumn]: arrayMove(
          columns[overColumn].tasks,
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  }

  function findColumn(id) {
    return Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.id === id)
    );
  }
}
