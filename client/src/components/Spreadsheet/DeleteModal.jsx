import { React } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT } from "../../graphql/mutations/projectMutations";

const DeleteModal = ({ isOpen, onClose, onConfirm, projectId, adminId }) => {
  const [deleteProject] = useMutation(DELETE_PROJECT, {
    variables: {
      projectId: projectId,
      adminId: adminId,
    },
  });

  const handleDeleteProject = (e) => {
    e.preventDefault();
    deleteProject();
    onConfirm();
    console.log("Project Deleted");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this project?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProject}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
