import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/ProjectContext";
import { ADD_MEMBERS } from "../../graphql/mutations/projectMutations";

const AddMembers = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const { user } = useAuth();
  const { state } = useStore();
  const [addMembers] = useMutation(ADD_MEMBERS, {
    variables: {
      projectId: state.projectId,
      adminId: user.id,
      userEmail: formData.email,
    },
  });

  const handleAction = async (e) => {
    e.preventDefault();
    addMembers();
  };

  return (
    <>
      <form onSubmit={handleAction} className="flex">
        <label className="text-gray-700">
          <span className="text-[#D2BAC3]">Add a member</span>
          <input
            type="email"
            placeholder="john@example.com"
            className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </label>
        <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 ease-in-out">
          Submit
        </button>
      </form>
    </>
  );
};

export default AddMembers;
