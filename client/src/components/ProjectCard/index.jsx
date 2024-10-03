import React, { useState } from "react";
import "./projectcard.css";
const cards = [
  { title: "Task 1", description: "Description 1", members: "Member A" },
  { title: "Task 2", description: "Description 2", members: "Member B" },
  { title: "Task 3", description: "Description 3", members: "Member C" },
  { title: "Task 4", description: "Description 4", members: "Member D" }, // Additional card for carousel
];

const ProjectCard = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 3) % cards.length);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex - 3 < 0 ? cards.length - 3 : prevIndex - 3
    );
  };

  // Slicing array of cards to show only 3 at a time
  const visibleCards = cards.slice(startIndex, startIndex + 3);

  return (
    <div className="p-8">
      <div className="col-span-3 bg-blue-100 p-4 rounded-lg shadow-md">
        {/* Card Grid */}
        <div className="bg-white rounded-lg p-4 shadow-sm grid grid-cols-3 gap-4">
          {visibleCards.map((card, index) => (
            <div
              key={index}
              className="bg-blue-400 rounded-lg shadow-md hover:bg-blue-500 transition-colors p-2 flex flex-col justify-between"
            >
              <div className="title text-lg font-bold text-white">{card.title}</div>
              <div className="description text-white">{card.description}</div>
              <div className="members text-sm text-white">{card.members}</div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        {cards.length > 3 && (
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 p-2 rounded hover:bg-gray-400"
              onClick={handlePrev}
            >
              Previous
            </button>
            <button
              className="bg-gray-300 p-2 rounded hover:bg-gray-400"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
