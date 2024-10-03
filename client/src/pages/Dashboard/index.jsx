import React, { useState } from "react";
import { useMutation } from "@apollo/client";
//import graphql mutation that has some auth shit, also a shit that returns user info that is required to display and allow them to create project/column/task.
import Header from "../../components/Header"
import ProjectCard from "../../components/ProjectCard";

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
            <ProjectCard />

        </>
    )
}


export default Dashboard