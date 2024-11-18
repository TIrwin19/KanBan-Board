import React, { useState } from "react";
import { useMutation } from "@apollo/client";
//import graphql mutation that has some auth shit, also a shit that returns user info that is required to display and allow them to create project/column/task.
import Header from "../../components/Header";
import ProjectCard from "../../components/ProjectCard";
import Welcome from "../../components/Welcome";
import Welcome2 from "../../components/Welcome/welcome2";
import Welcome3 from "../../components/Welcome/welcome3";
import ProjectsDue from "../../components/ProjectsDue";
import Calendar from "../../components/Calendar";
import OngoingProjects from "../../components/Ongoing";
import "./dashboard.css";
import User from "../../components/User";
import JoinedProjectCard from "../../components/JoinedProjectCard";

const Dashboardnew = () => {
  const [isJoined, setIsJoined] = useState(false);

  const displayJoined = () => {
    setIsJoined(true);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 h-screen">
      {/* Left Column */}
      <div className="flex flex-col space-y-4 flex-grow w-full lg:w-2/4 xl:w-2/5">
        <div className="bg-gray-200 rounded-lg p-4 flex flex-col justify-center space-y-4 h-full">
          <div className="flex flex-col items-center md:items-baseline space-y-4">
            <Welcome />
            <Welcome2 />
            <Welcome3 />
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg p-4 flex-grow">
          <span className="text-2xl font-bold text-[#363636]">
            Your projects
          </span>
          <ProjectCard />
        </div>
        <div className="bg-gray-200 rounded-lg p-4 flex-grow">
          <span className="text-2xl font-bold text-[#363636]  ">
            Joined projects
          </span>
          <JoinedProjectCard />
        </div>
      </div>

      {/* Right Column should stay right every size */}
      <div className="flex flex-col space-y-4 w-full lg:w-1/4 xl:w-1/5 lg:flex-shrink-0">
        <div className="bg-gray-200 rounded-lg p-4 h-1/2">
          <User />
        </div>
        <div className="bg-gray-200 rounded-lg p-4 h-1/2">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Dashboardnew;
