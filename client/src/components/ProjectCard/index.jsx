import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./projectCard.css";

const initialTasks = {
    //graphql user task's ids
};

const ProjectCard = () => {
    return (
        <div className="p-8">
            <div className="text-2xl font-bold mb-6">Welcome, USER</div>

            {/* Board sections */}
            <div className="grid grid-cols-4 gap-4">
                {/* Your Board */}
                <div className="col-span-3 bg-blue-100 p-4 rounded-lg shadow-md">
                    <p className="text-lg font-semibold mb-4">Your Board</p>
                    <div className="bg-white rounded-lg p-4 shadow-sm grid grid-cols-3 gap-4">
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">CARD</div>
                    </div>
                </div>

                {/* Team Board */}
                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <p className="text-lg font-semibold mb-4">Team Board</p>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4">
                        {/* Clickable buttons for task columns */}
                        <button className="bg-green-200 rounded-lg p-4 shadow-md hover:bg-green-300 transition-colors">
                            To Do
                        </button>
                        <button className="bg-green-300 rounded-lg p-4 shadow-md hover:bg-green-400 transition-colors">
                            In Progress
                        </button>
                        <button className="bg-green-400 rounded-lg p-4 shadow-md hover:bg-green-500 transition-colors">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
