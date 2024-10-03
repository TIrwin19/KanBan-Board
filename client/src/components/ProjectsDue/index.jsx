import React, { useState } from "react";

export default function ProjectsDue() {
  return (
    <div className="col-span-3 bg-blue-100 p-4 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4 shadow-sm grid grid-cols-3 gap-4">
        <div className="bg-blue-400 rounded-lg p-4 shadow-md hover:bg-blue-500 transition-colors">
          Projects Due Today
        </div>
      </div>
    </div>
  );
}
