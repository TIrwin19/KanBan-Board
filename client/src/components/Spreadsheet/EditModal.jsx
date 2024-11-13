import { React, useState } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_PROJECT } from "../../graphql/mutations/projectMutations";

const EditModal = ({ isOpen, onClose, onConfirm, projectId }) => {
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const [editProject] = useMutation(EDIT_PROJECT, {
    variables: {
      projectId: projectId,
      newName: newName,
    },
  });

  const handleEditProject = async (e) => {
    e.preventDefault();
    const { data } = await editProject();
    setMessage(data.editProject);
    setNewName("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
        <h3 className="text-lg font-bold mb-4">Edit Project</h3>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter new project name"
          onChange={(e) => setNewName(e.target.value)}
        />
        {message && <p className="text-green-600 mb-2">{message}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleEditProject}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
