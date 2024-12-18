import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/ProjectContext";
import { ADD_MEMBERS } from "../../graphql/mutations/projectMutations";
import { GET_PROJECT } from "../../graphql/queries/projectQueries";

const AddMembers = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [message, setMessage] = useState(""); // State for message
  const [messageColor, setMessageColor] = useState(""); // Text color for message
  const { user } = useAuth();
  const { state } = useStore();

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: {
      projectId: state.projectId,
    },
  });

  const [addMembers] = useMutation(ADD_MEMBERS, {
    variables: {
      projectId: state.projectId,
      adminId: user.id,
      userEmail: formData.email,
    },
  });

  const getMessageColorClass = (color) => {
    switch (color) {
      case "red":
        return "text-red-500";
      case "yellow":
        return "text-yellow-500";
      case "green":
        return "text-green-500";
      default:
        return "text-white"; // Fallback
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addMembers(); // Await the mutation and capture response
      // console.log("Color from resolver:", data.addMembers.color); // Debug
      setMessage(data.addMembers.message); // Set success message
      setMessageColor(getMessageColorClass(data.addMembers.color)); // Map to valid class
      setFormData({ email: "" }); // Clear input field after success
    } catch (error) {
      setMessage(error.message); // Set error message if mutation fails
      setMessageColor("text-red-500"); // Set error color
    }
  };

  // function capitalizeEachWord(string) {
  //   return string
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  // }

  const title = data?.getProject.title;
  const currentUser = user.id;
  const projectAdmin = data?.getProject.admin.id;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        {data && (
          <h1 className="text-slate-50 text-xl font-bold mb-4">{title}</h1>
        )}
        {currentUser === projectAdmin && (
          <form onSubmit={handleAction} className="flex items-end mb-4 ">
            <label className="text-gray-700">
              <input
                type="email"
                placeholder="john@example.com"
                className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {/* <span className="text-[#D2BAC3] text-xs">Add a member</span> */}
            </label>
            <button className="bg-green-500 h-fit px-2 py-[9px] ml-2 rounded-md hover:bg-green-600 transition-all duration-300 ease-in-out">
              Add
            </button>
          </form>
        )}
        {message && (
          <div className={`${messageColor} mb-2`}>
            <p>{message}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AddMembers;
