import React, { useRef, useState } from "react";
import "./joinedProjectCard.css";
import { useQuery } from "@apollo/client";
import { GET_JOINED_PROJECT } from "./../../graphql/queries/projectQueries";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import { useStore } from "../../contexts/ProjectContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

const JoinedProjectCard = () => {
  const { user } = useAuth();
  const { setProjectId } = useStore();

  const { loading, error, data } = useQuery(GET_JOINED_PROJECT, {
    variables: { userId: user.id },
    pollInterval: 1000,
  });

  const cards = data?.getJoinedProject || [];
  const scrollRef = useRef(null);
  const [scrollInterval, setScrollInterval] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching projects:", error);
    return <p>Error fetching projects.</p>;
  }

  const handleViewProject = async (projectId) => {
    await setProjectId(projectId);
  };

  const startScrolling = (direction) => {
    const scrollAmount = 3; // Increase this value to scroll faster
    const scrollInterval = 5; // Decrease this value for more frequent scroll updates

    const intervalId = setInterval(() => {
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "auto",
      });
    }, scrollInterval); // Roughly 60 frames per second

    setScrollInterval(intervalId);
  };

  const stopScrolling = () => {
    clearInterval(scrollInterval);
    setScrollInterval(null);
  };

  return (
    <div className="relative overflow-x-hidden scrollable-container">
      <div
        className="scroll-area left-scroll flex justify-center transition ease-in-out delay-75 hover:scale-110 duration-150"
        onMouseEnter={() => startScrolling("left")}
        onMouseLeave={stopScrolling}
      >
        <ChevronLeftIcon className="text-white " />
      </div>
      <div
        className="scrollable space-x-4"
        ref={scrollRef}
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col p-4  border rounded-lg shadow bg-gray-800 border-gray-700 min-h-[250px] max-h-[250px] min-w-[200px] max-w-[200px]"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {card.title}
            </h5>
            <p className="flex-grow mb-3 font-normal text-gray-700 dark:text-gray-400 break-words">
              {/* {card.description} */}
              description
            </p>
            {/* <p className="text-sm text-gray-600 dark:text-gray-300">
              Members: {card.members}
            </p> */}
            <NavLink
              to={`/project/${card.id}`}
              onClick={() => handleViewProject(card.id)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Link to project
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </NavLink>
          </div>
        ))}
      </div>
      <div
        className="scroll-area right-scroll flex justify-center transition ease-in-out delay-75 hover:scale-110 duration-150"
        onMouseEnter={() => startScrolling("right")}
        onMouseLeave={stopScrolling}
      >
        <ChevronRightIcon className="text-white hover:" />
      </div>
    </div>
  );
};

export default JoinedProjectCard;
