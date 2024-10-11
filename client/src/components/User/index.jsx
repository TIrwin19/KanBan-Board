import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/queries/authQuerie";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../../graphql/mutations/authMutations";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "@apollo/client";

export default function User() {
  const { logout } = useAuth(); // Access setAccessToken from context
  const navigate = useNavigate();
  const [logoutMutation] = useMutation(LOGOUT);
  const handleLogout = async () => {
    logout(); // Call logout from AuthContext
    await logoutMutation();
    navigate("/"); // Redirect to landing page
  };

  const { loading, error, data } = useQuery(GET_USER);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("The fucking error fetching user data is :", error);
    return <p>Error fetching user data.</p>;
  }
  const username = data.getUser.username;
  const apiUrl = `https://avatar.iran.liara.run/username?username=${username}+`;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
  //   const avatarsMale = [ "7", "19", "27", "41", "36", "43"]
  //   const avatarsFemale = [ "53", "85", "61", "88", "96", "62"]

  return (
    <div>
      <button type="button" onClick={toggleModal}>
        <img src={apiUrl} />
      </button>

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
            <h3 className="text-xl font-bold mb-4">Modal title</h3>
            <button className="grid grid-cols-4 gap-4">
              {avatars.map((avatar) => (
                <img src={`https://avatar.iran.liara.run/public/${avatar}`} />
              ))}
            </button>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={toggleModal}
                className="mr-2 py-2 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800"
              >
                Close
              </button>
              <button
                type="button"
                className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-[#353535] text-[#d0cec4] px-4 py-2 rounded hover:bg-[#4E4E4E] transition-all duration-300 ease-in-out"
      >
        Logout
      </button>
    </div>
  );
}
