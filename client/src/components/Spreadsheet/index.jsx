import React, { useState, useEffect } from "react";
import { ExternalLinkIcon, DotsVerticalIcon } from "@heroicons/react/outline";

const Spreadsheet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const data = [
    {
      title: "Project Alpha",
      members: "John, Sarah, Mike",
      date: "2024-10-01",
      todo: 3,
      inProgress: 2,
      done: 1,
    },
    {
      title: "Project Beta",
      members: "Emily, Michael",
      date: "2024-09-28",
      todo: 4,
      inProgress: 3,
      done: 2,
    },
    {
      title: "Project Gamma",
      members: "Chris, Jessica, Ashley",
      date: "2024-09-30",
      todo: 5,
      inProgress: 1,
      done: 4,
    },
    {
      title: "Project Delta",
      members: "James, Linda",
      date: "2024-10-05",
      todo: 2,
      inProgress: 2,
      done: 3,
    },
    {
      title: "Project Epsilon",
      members: "Anna, David",
      date: "2024-10-03",
      todo: 1,
      inProgress: 3,
      done: 2,
    },
  ];

  return (
    <div className="text-[#363636] p-4 h-screen flex flex-col">
      <div className="hidden md:grid grid-cols-10 bg-gray-100 p-2 rounded-t-lg border-b border-gray-300 divide-x divide-gray-300">
        <div className="col-span-2 font-bold text-center">Title</div>
        <div className="col-span-2 font-bold text-center">Members</div>
        <div className="col-span-1 font-bold text-center">Date Created</div>
        <div className="col-span-1 font-bold text-center">To-Do</div>
        <div className="col-span-1 font-bold text-center">In-Progress</div>
        <div className="col-span-1 font-bold text-center">Done</div>
        <div className="col-span-2 font-bold text-center">Action</div>
      </div>

      <div className="overflow-y-auto h-full">
        {data.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-10 border-b border-gray-200 p-2 items-center bg-gray-50 divide-y md:divide-y-0 md:divide-x divide-gray-200"
          >
            <div className="col-span-2 flex md:items-center md:justify-center">
              <ExternalLinkIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-center w-full">{item.title}</span>
            </div>
            <div className="col-span-2 flex md:items-center md:justify-center">
              <span className="text-center w-full">{item.members}</span>
              <button onClick={toggleModal}>
                <DotsVerticalIcon className="h-5 w-5 text-gray-600 ml-2" />
              </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                  <button
                    onClick={toggleModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-bold mb-4">Project Members</h3>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="mr-2 py-2 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
                    >
                      Add Member
                    </button>
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="mr-2 py-2 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="md:col-span-1 text-center mt-2 md:mt-0">
              <span>{item.date}</span>
            </div>

            <div className="md:col-span-1 flex md:flex-col justify-between md:justify-center mt-2 md:mt-0 items-center text-center">
              <span className="md:hidden font-semibold">To-Do:</span>
              <span>{item.todo}</span>
            </div>
            <div className="md:col-span-1 flex md:flex-col justify-between md:justify-center mt-2 md:mt-0 items-center text-center">
              <span className="md:hidden font-semibold">In-Progress:</span>
              <span>{item.inProgress}</span>
            </div>
            <div className="md:col-span-1 flex md:flex-col justify-between md:justify-center mt-2 md:mt-0 items-center text-center">
              <span className="md:hidden font-semibold">Done:</span>
              <span>{item.done}</span>
            </div>

            <div className="md:col-span-2 flex md:flex-row justify-center space-x-2 mt-2 md:mt-0">
              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Edit
              </button>
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Add Team
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spreadsheet;
