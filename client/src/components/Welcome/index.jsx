import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/queries/authQuerie";
import workingAnimation from "../../assets/workingAnimation.json";
import Lottie from "lottie-react";
import ImagePreloader from "./../../../node_modules/lottie-web/player/js/utils/imagePreloaderWorkerOverride";
import toyota from "../../assets/toyota.webm";

import toyotaA80 from "../../assets/toyotaSupraA80.json";

export default function Welcome() {
  const { loading, error, data } = useQuery(GET_USER);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching user data:", error);
    return <p>Error fetching user data.</p>;
  }
  const username = data.getUser.username;

  return (
    <>
      <div className="w-full h-full flex items-center ">
        {/* Content goes here */}
        <div className="">{`WELCOME ${username.toUpperCase()}`}</div>
      </div>
    </>
  );
}
