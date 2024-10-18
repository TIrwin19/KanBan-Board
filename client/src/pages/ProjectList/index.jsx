import React from "react";
import { NavLink } from "react-router-dom";
import { ExternalLinkIcon, LogoutIcon } from "@heroicons/react/outline";
import Spreadsheet from "../../components/Spreadsheet";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../graphql/mutations/authMutations";

const ProjectList = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutMutation] = useMutation(LOGOUT);

  const handleLogout = async () => {
    logout();
    await logoutMutation();
    navigate("/");
  };

  return (
    <div className="text-[#363636] p-4 flex flex-col bg-gray-50">

      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg border-b border-gray-300">
        <div className="text-2xl font-bold">
          Hello, User!
        </div>
        <div className="flex space-x-4">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 p-2 transition-all duration-200 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 hover:text-black rounded-lg"
          >
            <ExternalLinkIcon className="h-5 w-5" />
            Dashboard
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 transition-all duration-200 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 hover:text-black rounded-lg"
          >
            <LogoutIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>


      <div className="flex flex-col flex-grow mt-6">
        <div className="mb-4 text-lg font-semibold text-gray-700">
          Your Projects
        </div>
        <div className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <Spreadsheet />
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
