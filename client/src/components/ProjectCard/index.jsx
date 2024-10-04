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
    <>

    </>
  );
};

export default ProjectCard;
