import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/queries/authQuerie";
import workingAnimation from "../../assets/workingAnimation.json";
import Lottie from "lottie-react";
import ImagePreloader from "./../../../node_modules/lottie-web/player/js/utils/imagePreloaderWorkerOverride";
import toyota from "../../assets/toyota.webm";
import './welcome.css'

import toyotaA80 from "../../assets/toyotaSupraA80.json";

export default function Welcome() {
const { loading, error, data } = useQuery(GET_USER);
const [typedUsername, setTypedUsername] = useState("");
const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data && data.getUser && data.getUser.username) {
      const username = data.getUser.username.toUpperCase();
      if (currentIndex < username.length) {
        const timeoutId = setTimeout(() => {
          setTypedUsername((prev) => prev + username[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 120); // typing speed
        return () => clearTimeout(timeoutId);
      } else {
        // Reset after finishing typing for infinite loop
        setTimeout(() => {
          setTypedUsername("");
          setCurrentIndex(0);
        }, 5000); // delay before resetting
      }
    }
  }, [currentIndex, data]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching user data:", error);
    return <p>Error fetching user data.</p>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#b32e68] via-[#506476] to-[#b32e68] bg-clip-text text-transparent animate-gradient-xy whitespace-nowrap overflow-hidden typing-animation">
        {`WELCOME ${typedUsername}`}
      </div>
    </div>
  );
}
