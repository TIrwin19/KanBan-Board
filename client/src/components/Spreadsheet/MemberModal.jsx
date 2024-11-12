import React from "react";

const MemberModal = ({ isOpen, onClose, members, onAddMember }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4">Project Members</h3>

        <div className="grid grid-cols-5">
          {members.map((member, index) => (
            <div key={index} className="space-x-3 flex flex-col justify-center">
              <img
                className="w-14 h-14 border-2 border-gray-600 rounded-full"
                src={member.avatar}
                alt={member.username}
              />
              <div className="text-black">{member.username}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 py-2 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
          >
            Close
          </button>
          <button
            type="button"
            className="mr-2 py-2 px-4 rounded-lg border border-gray-300 bg-green-600 hover:bg-green-700 text-white"
            onClick={onAddMember}
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
