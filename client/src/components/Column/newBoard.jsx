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
import { useAuth } from "../../contexts/AuthContext.jsx";
import TaskModal from "../Task/TaskModal.jsx";
import DeleteTaskModal from "../Delete/DeleteTaskModal.jsx";
import Column from "./index.jsx";
import { Task } from "../Task/index.jsx";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_TASKS,
  GET_PROJECT,
} from "../../graphql/queries/projectQueries.jsx";
import { UPDATE_PROJECT_COLUMNS } from "../../graphql/mutations/columnMutations.js";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";

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
      tasks: [{ id: "task1", title: "Example 1", dueDate: "2023-10-01" }],
    },
    column2: {
      title: "In Progress",
      order: "column2",
      tasks: [{ id: "task2", title: "Example 2", dueDate: "2023-10-02" }],
    },
    column3: {
      title: "Done",
      order: "column3",
      tasks: [{ id: "task3", title: "Example 3", dueDate: "2023-10-03" }],
    },
  });

  const [activeId, setActiveId] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const addTask = (newTask, columnId) => {
    if (!columns[columnId]) {
      console.error(`Column with id ${columnId} does not exist.`);
      return;
    }

    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask],
      },
    }));
  };

  const { state } = useStore();
  const { user } = useAuth();

  const currentUser = user.id;

  const {
    loading: loadingTasks,
    error: errorTasks,
    data: tasksData,
  } = useQuery(GET_TASKS, {
    variables: {
      projectId: state.projectId,
    },
    pollInterval: 1000,
  });

  const {
    loading: loadingProject,
    error: errorProject,
    data: projectData,
  } = useQuery(GET_PROJECT, {
    variables: {
      projectId: state.projectId,
    },
  });

  const projectAdmin = projectData?.getProject.admin.id;

  useEffect(() => {
    if (tasksData) {
      const tasks = tasksData.getTasks;

      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };
        tasks.forEach((column) => {
          const columnId = column.order;
          // console.log(column);
          // console.log("ColumnId", columnId);
          if (!updatedColumns[columnId]) {
            updatedColumns[columnId] = { title: column.title, tasks: [] };
          }
          updatedColumns[columnId].tasks = column.tasks;
        });

        return updatedColumns;
      });
    }
  }, [tasksData]);

  const [updateProjectColumns] = useMutation(UPDATE_PROJECT_COLUMNS);

  useEffect(() => {
    if (Object.keys(columns).length === 0) return;

    const formattedColumns = Object.entries(columns).map(
      ([columnId, column]) => ({
        order: columnId,
        tasks: column.tasks.map((task) => ({
          order: task.order,
          title: task.title,
        })),
      })
    );

    // console.log("Formatted columns:", formattedColumns);

    updateProjectColumns({
      variables: {
        projectId: state.projectId,
        columns: formattedColumns,
      },
    }).catch((err) => console.error("Failed to update columns:", err));
  }, [columns, updateProjectColumns, state.projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // console.log(columns);

  if (loadingTasks) return <p>Loading...</p>;
  if (errorTasks) return <p>Error: {error.message}</p>;

  if (loadingProject) return <p>Loading...</p>;
  if (errorProject) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-x-4">
      <DndContext
        announcements={defaultAnnouncements}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
          {currentUser === projectAdmin && (
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              <div className="relative group h-fit">
                <button
                  onClick={() => setModalOpen(true)}
                  className="h-fit bg-blue-500 text-slate-50 p-1 rounded-lg text-2xl font-bold"
                >
                  <PlusIcon className="h-6 w-6" />
                </button>
                <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 hidden rounded-lg bg-gray-50 text-black text-xs py-1 px-2 group-hover:block">
                  Add Task
                </span>
              </div>

              <div className="relative group h-fit">
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="h-fit bg-red-500 text-slate-50 p-1 rounded-lg text-2xl font-bold"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
                <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 hidden rounded-lg bg-gray-50 text-black text-xs py-1 px-2 group-hover:block">
                  Delete Task
                </span>
              </div>
            </div>
          )}
          <div className="relative group h-fit">
            <NavLink to={"/dashboard"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 text-slate-50 bg-green-500 p-1 rounded-lg text-2xl font-bold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            </NavLink>
            <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 hidden rounded-lg bg-gray-50 text-black text-xs py-1 px-2 group-hover:block">
              Dashboard
            </span>
          </div>
        </div>

        <TaskModal
          addTask={addTask}
          columns={Object.keys(columns).map((id) => ({
            id,
            title: columns[id].title,
          }))}
          isOpen={isModalOpen}
          setIsOpen={setModalOpen}
        />

        <DeleteTaskModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setDeleteModalOpen}
        />

        {Object.keys(columns).map((columnId) => (
          <Column
            key={columnId}
            title={columns[columnId].title}
            columnId={columnId}
            tasks={columns[columnId].tasks}
          />
        ))}
        <DragOverlay>
          {activeId ? (
            <Task id={activeId} task={findTaskById(activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function findTaskById(id) {
    for (const column of Object.values(columns)) {
      const task = column.tasks?.find((task) => task.order === id);
      if (task) {
        return task;
      }
    }
    return null;
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;
    // console.log("Drag Start:", id);
    setActiveId(id);
  }

  function findColumn(id) {
    return Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task.order === id)
    );
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over || {};
    // console.log("Drag Over:", id, overId);
    const activeColumn = findColumn(id);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    setColumns((prev) => {
      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];

      const activeIndex = activeItems.tasks.findIndex(
        (task) => task.order === id
      );
      const overIndex = overItems.tasks.findIndex(
        (task) => task.order === overId
      );

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.tasks.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.tasks.length - 1 &&
          draggingRect &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex =
          overIndex >= 0 ? overIndex + modifier : overItems.tasks.length + 1;
      }

      return {
        ...prev,
        [activeColumn]: {
          ...prev[activeColumn],
          tasks: prev[activeColumn].tasks.filter((item) => item.order !== id),
        },
        [overColumn]: {
          ...prev[overColumn],
          tasks: [
            ...prev[overColumn].tasks.slice(0, newIndex),
            prev[activeColumn].tasks[activeIndex],
            ...prev[overColumn].tasks.slice(
              newIndex,
              prev[overColumn].tasks.length
            ),
          ],
        },
      };
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const { id: activeId } = active;
    const { id: overId } = over;
    // console.log("Drag End:", activeId, overId);
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn) {
      return;
    }

    if (!overColumn) {
      // Handle dropping into an empty column
      const emptyColumn = Object.keys(columns).find(
        (key) => columns[key].tasks.length === 0
      );

      // console.log("emptyColumn", emptyColumn);

      if (emptyColumn) {
        const task = findTaskById(activeId);
        if (task) {
          setColumns((columns) => ({
            ...columns,
            [activeColumn]: {
              ...columns[activeColumn],
              tasks: columns[activeColumn].tasks.filter(
                (task) => task.order !== activeId
              ),
            },
            [emptyColumn]: {
              ...columns[emptyColumn],
              tasks: [...columns[emptyColumn].tasks, task],
            },
          }));
        }
      }
    } else {
      const activeIndex = columns[activeColumn].tasks.findIndex(
        (task) => task.order === activeId
      );
      const overIndex = columns[overColumn].tasks.findIndex(
        (task) => task.order === overId
      );

      if (activeIndex !== overIndex) {
        setColumns((columns) => ({
          ...columns,
          [overColumn]: {
            ...columns[overColumn],
            tasks: arrayMove(columns[overColumn].tasks, activeIndex, overIndex),
          },
        }));
      }
    }

    setActiveId(null);
  }
}
