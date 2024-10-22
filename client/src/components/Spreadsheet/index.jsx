import React, { useState } from "react";
import { ExternalLinkIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  SelectorIcon,
  PencilAltIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import MemberModal from "./MemberModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import AddModal from "./AddModal";



const Spreadsheet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [data, setData] = useState([
    {
      title: "Project Alpha",
      members: [
        { name: "John", avatarUrl: "https://avatar.iran.liara.run/public/7" },
        { name: "Sarah", avatarUrl: "https://avatar.iran.liara.run/public/19" },
        { name: "Mike", avatarUrl: "https://avatar.iran.liara.run/public/27" },
      ],
      date: "2024-10-01",
      todo: 3,
      inProgress: 2,
      done: 1,
    },
    {
      title: "Project Beta",
      members: [
        { name: "Emily", avatarUrl: "https://avatar.iran.liara.run/public/36" },
        {
          name: "Michael",
          avatarUrl: "https://avatar.iran.liara.run/public/43",
        },
      ],
      date: "2024-09-28",
      todo: 4,
      inProgress: 3,
      done: 2,
    },
    {
      title: "Project Gamma",
      members: [
        { name: "Chris", avatarUrl: "https://avatar.iran.liara.run/public/53" },
        {
          name: "Jessica",
          avatarUrl: "https://avatar.iran.liara.run/public/85",
        },
        {
          name: "Ashley",
          avatarUrl: "https://avatar.iran.liara.run/public/61",
        },
      ],
      date: "2024-09-30",
      todo: 5,
      inProgress: 1,
      done: 4,
    },
    {
      title: "Project Delta",
      members: [
        { name: "James", avatarUrl: "https://avatar.iran.liara.run/public/88" },
        { name: "Linda", avatarUrl: "https://avatar.iran.liara.run/public/96" },
      ],
      date: "2024-10-05",
      todo: 2,
      inProgress: 2,
      done: 3,
    },
    {
      title: "Project Epsilon",
      members: [
        { name: "Anna", avatarUrl: "https://avatar.iran.liara.run/public/62" },
        { name: "David", avatarUrl: "https://avatar.iran.liara.run/public/41" },
      ],
      date: "2024-10-03",
      todo: 1,
      inProgress: 3,
      done: 2,
    },
  ]);

  //ALL MODALS SECTION

  //members modal section
  const openModal = (members) => {
    setSelectedMembers(members);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMembers([]);
  };

  const handleAddMember = () => {
    closeModal();
    openAddModal();
  };
  //members modal section end

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  //REWORK DELETE TO WORK WITH ID
  const toggleDeleteModal = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const confirmDelete = () => {
    if (projectToDelete !== null) {
      setData((prevData) =>
        prevData.filter((_, index) => index !== projectToDelete)
      );
      setProjectToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };
  //ALL MODALS SECTION


  ///SORTING LOGIC////////
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sortedData = [...data].sort((a, b) => {
      if (key === "title") {
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else if (key === "date") {
        return direction === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      } else {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUpIcon className="h-4 w-4 inline ml-1" />
      ) : (
        <ChevronDownIcon className="h-4 w-4 inline ml-1" />
      );
    }
    return <SelectorIcon className="h-4 w-4 inline ml-1" />;
  };
  ///SORTING LOGIC ///////

  return (
    <div className="text-[#363636] p-4 flex flex-col">
      <div className="hidden md:grid grid-cols-10 bg-gray-100 p-2 rounded-t-lg border-b border-gray-300 divide-x divide-gray-300">
        <div
          className="col-span-2 font-bold text-center cursor-pointer"
          onClick={() => sortData("title")}
        >
          Title {renderSortIcon("title")}
        </div>
        <div className="col-span-2 font-bold text-center">Members</div>
        <div
          className="col-span-1 font-bold text-center cursor-pointer"
          onClick={() => sortData("date")}
        >
          Date Created {renderSortIcon("date")}
        </div>
        <div
          className="col-span-1 font-bold text-center cursor-pointer"
          onClick={() => sortData("todo")}
        >
          To-Do {renderSortIcon("todo")}
        </div>
        <div
          className="col-span-1 font-bold text-center cursor-pointer"
          onClick={() => sortData("inProgress")}
        >
          In-Progress {renderSortIcon("inProgress")}
        </div>
        <div
          className="col-span-1 font-bold text-center cursor-pointer"
          onClick={() => sortData("done")}
        >
          Done {renderSortIcon("done")}
        </div>
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
              <div className="flex -space-x-2">
                {item.members.map((member, i) => (
                  <img
                    key={i}
                    className="w-8 h-8 border-2 border-white rounded-full"
                    src={member.avatarUrl}
                    alt={member.name}
                    title={member.name}
                  />
                ))}
              </div>
              <button onClick={() => openModal(item.members)}>
                <DotsVerticalIcon className="h-5 w-5 text-gray-600 ml-2" />
              </button>
            </div>
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
              <button
                className="flex items-center bg-blue-200 px-2 py-1 rounded-md text-sm"
                title="Edit"
                onClick={() => openEditModal()}
              >
                <PencilAltIcon className="h-4 w-4" />
              </button>
              <button
                className="flex items-center bg-green-200 px-2 py-1 rounded-md text-sm"
                title="Edit Members"
                onClick={() => openAddModal()}
              >
                <PlusCircleIcon className="h-4 w-4" />
              </button>
              <button
                className="flex items-center bg-red-200 px-2 py-1 rounded-md text-sm"
                title="Delete"
                onClick={() => toggleDeleteModal(item)}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <MemberModal
        isOpen={isModalOpen}
        onClose={closeModal}
        members={selectedMembers}
        onAddMember={handleAddMember}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Spreadsheet;
