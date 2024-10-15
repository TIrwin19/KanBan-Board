import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_AVATAR } from "../../graphql/queries/authQuerie";
import { useNavigate, NavLink } from "react-router-dom";
import { LOGOUT } from "../../graphql/mutations/authMutations";
import { SET_AVATAR } from "../../graphql/mutations/authMutations"; // Import the SET_AVATAR mutation
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@apollo/client";
import {
  ChartBarIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

export default function User() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [logoutMutation] = useMutation(LOGOUT);
  const [setAvatarMutation] = useMutation(SET_AVATAR);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    user?.username
      ? `https://avatar.iran.liara.run/username?username=${user.username}+`
      : ""
  );

  const { loading, error, data } = useQuery(GET_USER_AVATAR, {
    variables: { userId: user.id },
    pollInterval: 1000,
  });
  // console.log(data);

  useEffect(() => {
    if (data) {
      // console.log("Data received from GraphQL:", data); // Log the entire data object
      const avatar = data.getUserAvatar;
      if (avatar) {
        // console.log("Setting avatar URL to:", avatar); // Log the avatar being set
        setAvatarUrl(avatar);
      }
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching avatar:", error);
    return <p>Error fetching avatar.</p>;
  }

  const handleLogout = async () => {
    logout();
    await logoutMutation();
    navigate("/");
  };

  const selectAvatar = async (avatar) => {
    const newAvatarUrl = `https://avatar.iran.liara.run/public/${avatar}`;
    // Call the setAvatar mutation to save the avatar in the backend
    try {
      // Call the setAvatar mutation to save the avatar in the backend
      await setAvatarMutation({
        variables: { userId: user.id, avatar: newAvatarUrl },
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
      // Optionally show an error message to the user
    }

    toggleModal();
  };

  const avatars = [
    "7",
    "19",
    "27",
    "41",
    "36",
    "43",
    "53",
    "85",
    "61",
    "88",
    "96",
    "62",
  ];

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const removeAvatar = () => {
    setAvatarUrl("");
    toggleModal();
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching user data.</p>
      ) : (
        <>
          <div className="flex items-center gap-6">
            <button
              className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              type="button"
              onClick={toggleModal}
            >
              <img src={avatarUrl} alt="User Avatar" />
            </button>
            <div className="font-medium dark:text-white">
              {capitalizeFirstLetter(user.username)}
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                  onClick={toggleModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4">Choose an Avatar</h3>
                <div className="grid grid-cols-4 gap-4">
                  {avatars.map((avatar) => (
                    <img
                      key={avatar}
                      src={`https://avatar.iran.liara.run/public/${avatar}`}
                      alt={`Avatar ${avatar}`}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => selectAvatar(avatar)}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="mr-2 py-2 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
                  >
                    Remove
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

          <div className="mt-4 flex flex-col gap-3">
            <NavLink
              to={`/projectlist/`}
              className="flex items-center gap-2 p-2 transition-all duration-200 text-gray-700 hover:text-black hover:font-bold"
            >
              <ChartBarIcon className="h-5 w-5" />
              Project List
              <ChevronRightIcon className="h-5 w-5 ml-auto" />
            </NavLink>
            <NavLink
              to={`/active-projects/${user.id}`}
              className="flex items-center gap-2 p-2 transition-all duration-200 text-gray-700 hover:text-black hover:font-bold"
            >
              <ClipboardListIcon className="h-5 w-5" />
              Active Projects
              <ChevronRightIcon className="h-5 w-5 ml-auto" />
            </NavLink>
            <NavLink
              to={`/completed-projects/${user.id}`}
              className="flex items-center gap-2 p-2 transition-all duration-200 text-gray-700 hover:text-black hover:font-bold"
            >
              <CheckCircleIcon className="h-5 w-5" />
              Completed Projects
              <ChevronRightIcon className="h-5 w-5 ml-auto" />
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 transition-all duration-200 text-gray-700 hover:text-black hover:font-bold"
            >
              <LogoutIcon className="h-5 w-5" />
              Logout
              <ChevronRightIcon className="h-5 w-5 ml-auto" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
