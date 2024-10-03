import React, { useState } from "react";
import { useMutation } from "@apollo/client";
//import graphql mutation that has some auth shit, also a shit that returns user info that is required to display and allow them to create project/column/task.
import Header from "../../components/Header";
import ProjectCard from "../../components/ProjectCard";
import Welcome from "../../components/Welcome";
import ProjectsDue from "../../components/ProjectsDue";
import Calendar from "../../components/Calendar";
import OngoingProjects from "../../components/Ongoing";

//functionalites join, create, leave, logout , invite
// we import them here import JOIN_GAME

const Dashboard = () => {
  // handleJOINGAME => by calling the JOIN_GAME graphql

  // we go return and make button that calls the handleJOINGAME functionality

  // DISPLAY THE USER
  // DISPLAY THE USER'S PROJECTS
  // DISPLAY CREATE PROJECT BUTTON
  // DISPLAY A REMINDER ON THE THINGS HE IS MISSING ETC

  return (
    <>
      <Header />
   

      <div class="grid grid-cols-5 grid-rows-5 gap-0">
        <div class="col-start-1 col-end-4 row-start-1 row-end-2">
          {" "}
          <Welcome />
        </div>
        <div class="col-start-5 col-end-6 row-start-1 row-end-2">
          {" "}
          <Calendar />
        </div>
        <div class="col-start-1 col-end-3 row-start-2 row-end-3">
          {" "}
          <ProjectCard />
        </div>
        <div class="col-start-5 col-end-6 row-start-2 row-end-3">
          {" "}
          <OngoingProjects />
        </div>
        <div class="col-start-1 col-end-4 row-start-3 row-end-4">
          <ProjectsDue />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
