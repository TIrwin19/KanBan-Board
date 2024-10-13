import React, { useState } from "react";
import "./projectcard.css";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_PROJECT } from "./../../graphql/queries/projectQueries";
import { useAuth } from "../../contexts/AuthContext";

const ProjectCard = () => {
  const { user } = useAuth();
  const { loading, error, data } = useQuery(GET_ADMIN_PROJECT, {
    variables: { adminId: user.id },
    pollInterval: 500,
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching projects:", error);
    return <p>Error fetching projects.</p>;
  }
  const cards = data.getAdminProject;
  console.log(cards);

  return (
    <div className="relative overflow-x-scroll scrollbar-hide">
      <div className="flex space-x-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 min-h-[250px] max-h-[250px] min-w-[200px] max-w-[200px]"
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
            <a
              href="#"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
