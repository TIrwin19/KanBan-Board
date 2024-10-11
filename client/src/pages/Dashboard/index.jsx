import React, { useState } from "react";
import { useMutation } from "@apollo/client";
//import graphql mutation that has some auth shit, also a shit that returns user info that is required to display and allow them to create project/column/task.
import Header from "../../components/Header";
import ProjectCard from "../../components/ProjectCard";
import Welcome from "../../components/Welcome";
import Welcome2 from "../../components/Welcome/welcome2";
import ProjectsDue from "../../components/ProjectsDue";
import Calendar from "../../components/Calendar";
import OngoingProjects from "../../components/Ongoing";
import "./dashboard.css";

//functionalites join, create, leave, logout , invite
// we import them here import JOIN_GAME

const Dashboard = () => {
  const [isDiv6Expanded, setIsDiv6Expanded] = useState(true);

  const toggleDiv6 = () => {
    setIsDiv6Expanded((prev) => !prev);
  };

  return (
    <>
      <Header />

      <div className="parent grid grid-cols-5 grid-rows-5 gap-4 h-screen relative">
        {/* div6 */}
        <div
          className={`div6 fixed top-0 left-0 ${isDiv6Expanded ? "w-1/5" : "w-0"
            } h-full the-shadow border-2 text-[#1D3557] rounded-xl p-0 transition-all duration-500 ease-in-out shadow-lg overflow-hidden `}
        >
          {isDiv6Expanded && <div className="pt-10">6</div>}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={toggleDiv6}
          className={`absolute top-4 ${isDiv6Expanded ? "left-[20%]" : "left-3"
            } transform -translate-x-1/2 button-color text-white p-2 rounded-full z-20 transition-all duration-500`}
        >
          {isDiv6Expanded ? "◀" : "➔"}
        </button>

        {/* Other Divs */}
        <div
          className={`div1 ${isDiv6Expanded ? "col-span-3 col-start-2" : "col-span-4 col-start-1"
            } row-span-2 row-start-1 the-shadow border-2 text-[#1D3557] rounded-xl p-4 transition-all duration-500`}
        >
          <div className="inner-grid grid grid-cols-2 grid-rows-2  gap-2 h-full">
            <div className="box1 bg-blue-200 p-2 col-start-1 col-end-3 row-start-1 row-end-1"> <Welcome />  </div>
            <div className="box2 bg-red-200 p-2 col-start-3 col-end-3 row-start-1 row-end-3"> <Welcome2 /> </div>
            <div className="box3 bg-green-200 p-2 col-start-1 col-end-2 row-start-2 row-end-3">
              <button
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 text-white"
              >
                Create Project
              </button>
              button no work
            </div>

          </div>
        </div>

        <div className="div3 row-span-2 col-start-5 row-start-4 the-shadow border-2 text-[#1D3557] rounded-xl p-4">
          <Calendar />
        </div>

        <div
          className={`div4 ${isDiv6Expanded ? "col-span-2 col-start-2" : "col-span-3 col-start-1"
            } row-span-2 row-start-3 the-shadow border-2 text-[#1D3557] rounded-xl p-4 transition-all duration-500`}
        >

          <div className="flex flex-col gap-2 h-full">
            <div className="item1 flex-2"> <ProjectCard /></div>

          </div>




        </div>

        <div className="div5 row-span-3 col-start-5 row-start-1 the-shadow border-2 text-[#1D3557] rounded-xl p-4">
          <button
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white"
          >
            Logout and shit
          </button>
          button no work
        </div>
      </div>
    </>
  );
};

export default Dashboard;
