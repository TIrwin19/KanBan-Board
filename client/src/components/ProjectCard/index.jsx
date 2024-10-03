import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import DateCalendarFormProps from "../Calendar/index.jsx"

const initialTasks = {
    //graphql user task's ids
};

const ProjectCard = () => {
    return (
        <div className="p-8">
            {/* <DateCalendarFormProps /> */}

            {/* Board sections */}
            <div className="grid grid-cols-4 gap-4">
                {/* Your Board */}
                <div className="col-span-3 bg-blue-100 p-4 rounded-lg shadow-md">
                    <div className="bg-white rounded-lg p-4 shadow-sm grid grid-cols-3 gap-4">
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">WELCOME USER</div>
                    </div>
                    has two buttons in section "Your Projects" and " Team Projects"
                </div>

                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <p className="text-lg font-semibold mb-4">Calender with message section </p>
                </div>

                <div className="col-span-3 bg-blue-100 p-4 rounded-lg shadow-md">
                    <div className="bg-white rounded-lg p-4 shadow-sm grid grid-cols-3 gap-4">
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">TASK 1 TITLE DESCRIPTION MEMEBERS</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">TASK 1 TITLE DESCRIPTION MEMEBERS</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">TASK 1 TITLE DESCRIPTION MEMEBERS</div>
                        section to have quick overview on on tasks
                    </div>
                </div>

                {/* Team Board */}
                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <p className="text-lg font-semibold mb-4">Ongoing Projects</p>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4">
                        {/* Clickable buttons for task columns */}
                        <button className="bg-green-200 rounded-lg p-4 shadow-md hover:bg-green-300 transition-colors">
                            1. Title Bold
                        </button>
                        <button className="bg-green-300 rounded-lg p-4 shadow-md hover:bg-green-400 transition-colors">
                            1. Title Bold
                        </button>
                        <button className="bg-green-400 rounded-lg p-4 shadow-md hover:bg-green-500 transition-colors">
                            1. Title Bold
                        </button>
                        vertical lists to see active projects your in
                    </div>
                </div>

                <div className="col-span-3 bg-blue-100 p-4 rounded-lg shadow-md">
                    <div className="bg-white rounded-lg p-4 shadow-sm grid grid-cols-3 gap-4">
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">Projects Due Today</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
