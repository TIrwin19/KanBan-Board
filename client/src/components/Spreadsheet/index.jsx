import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
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
import AddMemberModal from "./AddMemberModal";
import { useAuth } from "../../contexts/AuthContext";
import { GET_ADMIN_PROJECT } from "./../../graphql/queries/projectQueries";
import { NavLink } from "react-router-dom";
import { useStore } from "../../contexts/ProjectContext";

const Spreadsheet = () => {
  const { user } = useAuth();
  const { setProjectId } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [projects, setProjects] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fetching projects using GraphQL query
  const { loading, error, data } = useQuery(GET_ADMIN_PROJECT, {
    variables: { adminId: user.id },
    pollInterval: 1000,
  });

  useEffect(() => {
    if (data) {
      setProjects(data.getAdminProject || []);
    }
  }, [data]);

  const handleViewProject = async (projectId) => {
    await setProjectId(projectId);
  };

  // ALL MODALS SECTION
  const openModal = (members) => {
    setSelectedMembers(members);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMembers([]);
  };

  const openEditModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsEditModalOpen(true);
  };

  const openAddModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsAddModalOpen(true);
  };

  // REWORK DELETE TO WORK WITH ID
  const toggleDeleteModal = (projectId) => {
    setSelectedProjectId(projectId);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
  };

  // fixes the createdAt format
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // SORTING LOGIC
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...projects].sort((a, b) => {
      if (key === "title") {
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else if (key === "createdAt") {
        return direction === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      } else if (["todo", "inProgress", "done"].includes(key)) {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else if (key === "members") {
        return direction === "asc"
          ? (a[key]?.length || 0) - (b[key]?.length || 0)
          : (b[key]?.length || 0) - (a[key]?.length || 0);
      }
      return 0;
    });

    setProjects(sortedData); // Update projects with sorted data
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading projects.</p>;

  return (
    <div className="text-[#363636] p-4 flex flex-col">
      <div className="hidden md:grid grid-cols-10 bg-gray-100 p-2 rounded-t-lg border-b border-gray-300 divide-x divide-gray-300">
        <div
          className="col-span-2 font-bold text-center cursor-pointer"
          onClick={() => sortData("title")}
        >
          Title {renderSortIcon("title")}
        </div>
        <div
          className="col-span-2 font-bold text-center cursor-pointer"
          onClick={() => sortData("members")}
        >
          Members {renderSortIcon("members")}
        </div>
        <div
          className="col-span-1 font-bold text-center cursor-pointer"
          onClick={() => sortData("createdAt")}
        >
          Date Created {renderSortIcon("createdAt")}
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
        {projects.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-10 border-b border-gray-200 p-2 items-center bg-gray-50 divide-y md:divide-y-0 md:divide-x divide-gray-200"
          >
            <div className="col-span-2">
              <NavLink
                to={`/project/${item.id}`}
                onClick={() => handleViewProject(item.id)}
                className="flex md:items-center md:justify-center"
              >
                <ExternalLinkIcon className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-center w-full hover:text-black hover:font-bold">
                  {item.title}
                </span>
              </NavLink>
            </div>
            <div className="col-span-2 flex md:items-center md:justify-center">
              <div className="flex -space-x-2">
                {item.members?.map((member, i) => (
                  <img
                    key={i}
                    className="w-8 h-8 border border-gray-600 rounded-full"
                    src={member.avatar}
                    alt={member.name}
                    title={member.name}
                  />
                ))}
              </div>
              <button onClick={() => openModal(item.members || [])}>
                <DotsVerticalIcon className="h-5 w-5 text-gray-600 ml-2" />
              </button>
            </div>
            <div className="md:col-span-1 text-center mt-2 md:mt-0">
              <span>{item.createdAt ? formatDate(item.createdAt) : "N/A"}</span>
            </div>

            {item.columns.map((column) => (
              <div
                key={column._id}
                className="md:col-span-1 text-center mt-2 md:mt-0"
              >
                <p>{column.tasks.length}</p>
              </div>
            ))}

            <div className="md:col-span-2 flex items-center justify-center space-x-2 ">
              <div className="mt-1 relative group h-fit">
                <button
                  className="bg-blue-200 p-1 rounded-md text-blue-800"
                  onClick={() => openEditModal(item.id)}
                >
                  <PencilAltIcon className="h-5 w-5" />
                </button>
                <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 hidden rounded-lg bg-gray-50 text-black text-xs py-1 px-2 group-hover:block">
                  Edit Project Name
                </span>
              </div>
              <div className="mt-1 relative group h-fit">
                <button
                  className="bg-green-200 p-1 rounded-md text-green-800"
                  onClick={() => openAddModal(item.id)}
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </button>
                <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 hidden rounded-lg bg-gray-50 text-black text-xs py-1 px-2 group-hover:block">
                  Add Member
                </span>
              </div>
              <div className="mt-1 relative group h-fit">
                <button
                  className="bg-red-200 p-1 rounded-md text-red-800"
                  onClick={() => toggleDeleteModal(item.id)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 hidden rounded-lg bg-gray-50 text-black text-xs py-1 px-2 group-hover:block">
                  Delete Project
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MemberModal
        isOpen={isModalOpen}
        onClose={closeModal}
        members={selectedMembers}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={toggleDeleteModal}
        onConfirm={confirmDelete}
        projectId={selectedProjectId}
        adminId={user.id}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={selectedProjectId}
      />
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={selectedProjectId}
        adminId={user.id}
      />
    </div>
  );
};

export default Spreadsheet;
