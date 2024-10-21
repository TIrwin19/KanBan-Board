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

//functionalites join, create, leave, logout , invite
// we import them here import JOIN_GAME

const Dashboard = () => {
  const [isDiv6Expanded, setIsDiv6Expanded] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  const toggleDiv6 = () => {
    setIsDiv6Expanded((prev) => !prev);
  };

  const displayJoined = () => {
    setIsJoined(true);
  };

  return (
    <>
      <div className="text-[#363636] parent grid grid-cols-5 grid-rows-5 gap-4 h-screen relative">
        {/* div6 */}
        <div
          className={`div6 fixed top-0 left-0 ${
            isDiv6Expanded ? "w-0" : "w-1/6"
          } h-full the-shadow border-2 text-[#363636] rounded-xl p-0 transition-all duration-500 ease-in-out shadow-lg overflow-hidden `}
        >
          {isDiv6Expanded && <div className="pt-10">6</div>}
        </div>

        <button
          onClick={toggleDiv6}
          className={`absolute top-4 ${
            isDiv6Expanded ? "left-7" : "left-[15%]"
          } transform -translate-x-1/2 button-color text-white p-2 rounded-full z-20 transition-all duration-500`}
        >
          {isDiv6Expanded ? "➔" : "◀"}
        </button>

        {/* Other Divs */}
        <div
          className={`div1 ${
            isDiv6Expanded ? "col-span-4 col-start-1" : "col-span-3 col-start-2"
          } row-span-2 row-start-1 the-shadow border-2 text-[#363636] rounded-xl p-4 transition-all duration-500`}
        >
          <div className="inner-grid grid grid-cols-3 grid-rows-3 gap-2 h-full">
            <div className="box1 col-start-1 col-end-5 row-start-1 row-end-3">
              <Welcome />
            </div>

            <div className="box2 p-2 col-start-4 col-end-4 row-end-3">
              <Welcome2 />
            </div>

            <div className="box3 col-start-1 row-end-4">
              <Welcome3 />
            </div>
          </div>
        </div>

        <div className="div3 row-span-2 col-start-5 row-start-4 the-shadow border-2 text-[#363636] rounded-xl p-4">
          <Calendar />
        </div>

        <div
          className={`div4 ${
            isDiv6Expanded ? "col-span-4 col-start-1" : "col-span-3 col-start-2"
          } row-span-2 row-start-3 the-shadow border-2 text-[#363636] rounded-xl p-4 transition-all duration-500`}
        >
          <span className="text-xl text-gray-800 font-bold">Your Projects</span>
          <div className="flex flex-col gap-2 h-full pt-2">
            <div className="item1 flex-2">
              {" "}
              <ProjectCard />
            </div>
          </div>
        </div>

        <div
          className={`div4 ${
            isDiv6Expanded ? "col-span-4 col-start-1" : "col-span-3 col-start-2"
          } row-span-2 row-start-5 the-shadow border-2 text-[#363636] rounded-xl p-4 transition-all duration-500`}
        >
          <span className="text-xl text-gray-800 font-bold">
            Joined Projects
          </span>
          <div className="flex flex-col gap-2 h-full pt-2">
            <div className="item1 flex-2">
              <JoinedProjectCard />
            </div>
          </div>
        </div>

        <div className="div5 row-span-3 col-start-5 row-start-1 the-shadow border-2 text-[#363636] rounded-xl p-4">
          <User />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
