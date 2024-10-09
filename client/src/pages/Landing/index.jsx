import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LOGIN, REGISTER } from "../../graphql/mutations/authMutations";
import "./landing.css";

const Landing = () => {
  const [actionType, setActionType] = useState("login");

  const { login } = useAuth(); // Get login method from Auth context

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [loginUser] = useMutation(LOGIN, {
    variables: {
      username: formData.username,
      password: formData.password,
    },
  });

  const [registerUser] = useMutation(REGISTER, {
    variables: {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    },
  });

  const handleAction = async (e) => {
    e.preventDefault();
    if (actionType === "login") {
      const { data } = await loginUser();
      if (data && data.login) {
        login(data.login.accessToken); // Use login method to store the token
        navigate("/dashboard");
      }
    } else if (actionType === "register") {
      const { data } = await registerUser();
      if (data && data.register) {
        login(data.register.accessToken); // Use login method to store the token
        navigate("/dashboard");
      }
    }
  };
  // Dynamic form fields for both login and registration
  return (
    <div className="flex flex-col items-center auth-container">
      <form
        className="mt-10 w-5/6 flex flex-col items-center"
        onSubmit={handleAction}
      >
        <h1 className="text-3xl mb-5">
          {actionType === "login" ? "Login" : "Register"}
        </h1>

        <label className="text-gray-700">
          <span className="text-grey-700">Username</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            placeholder="Enter your Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </label>

        {actionType === "register" && (
          <label className="text-gray-700">
            <span className="text-grey-700">Email</span>
            <input
              type="email"
              className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required={actionType === "register"}
            />
          </label>
        )}

        <label className="text-gray-700">
          <span className="text-grey-700">Password</span>
          <input
            type="password"
            className="mt-1 block w-full rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 w-fit bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
        >
          {actionType === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          className="mt-2 w-full text-blue-500 underline"
          onClick={() =>
            setActionType(actionType === "login" ? "register" : "login")
          }
        >
          {actionType === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
};

export default Landing;
