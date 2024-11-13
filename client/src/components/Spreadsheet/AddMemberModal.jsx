import { React, useState } from "react";
import { ADD_MEMBERS } from "../../graphql/mutations/projectMutations";
import { useMutation } from "@apollo/client";

const AddMemberModal = ({ isOpen, onClose, projectId, adminId }) => {
  // console.log("projectId", projectId);
  // console.log("adminId", adminId);

  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const [addMembers] = useMutation(ADD_MEMBERS, {
    variables: {
      projectId: projectId,
      adminId: adminId,
      userEmail: userEmail,
    },
  });

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addMembers();
      setMessage(data.addMembers.message);
      setMessageColor(getMessageColorClass(data.addMembers.color));
    } catch (error) {
      setMessage("An error occurred");
      setMessageColor("text-red-500");
    }
  };

  const getMessageColorClass = (color) => {
    switch (color) {
      case "red":
        return "text-red-500";
      case "green":
        return "text-green-500";
      case "yellow":
        return "text-yellow-500";
      default:
        return "text-black";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <form className="bg-white rounded-lg p-6 w-full max-w-sm relative">
        <h3 className="text-lg font-bold mb-4">Invite Member</h3>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter member email"
          onChange={(e) => setUserEmail(e.target.value)}
        />
        {message && <p className={`${messageColor} mb-2`}>{message}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMember}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          >
            Invite
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberModal;
