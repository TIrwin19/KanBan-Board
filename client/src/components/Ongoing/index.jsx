import React, { useState } from "react";

export default function OngoingProjects() {
  return (
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
  );
}
