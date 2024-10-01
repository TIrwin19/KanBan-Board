import React, { useState } from "react";
import { useMutation } from "@apollo/client";
//import LOGIN_USER, REGISTER_USER
import { LOGIN, REGISTER } from "../../graphql/mutations/authMutations";
import "./landing.css";

const Landing = () => {
  const [login, setLogin] = useState(true); // assume that user has an account and login shown as default

  const [actionType, setActionType] = useState("login");
  //formdata

  const [accessToken, setAccessToken] = useState(null); //Access token

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  //mutations
  const [loginUser] = useMutation(LOGIN, {
    variables: loginData,
  });

  const [registerUser] = useMutation(REGISTER, {
    variables: registerData,
  });

  //handle login and register by using actionType
  const handleAction = async (e) => {
    e.preventDefault();
    if (actionType === "login") {
      const { data } = await loginUser();
      if (data && data.login) {
        setAccessToken(data.login.accessToken); // Store access token in state
        console.log("Access Token Stored:", data.login.accessToken);
        console.log("refresh token ", data.login)
      }
    } else {
      const { data } = await registerUser();
    }
  };

  return (
    <>
      <div>
        <h1>{actionType === "login" ? "Login" : "Register"}</h1>
        <form onSubmit={handleAction}>
          <div className="text-gray-700">Username</div>
          <input
            type="text"
            className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            placeholder="Enter your Username"
            value={
              actionType === "login"
                ? loginData.username
                : registerData.username
            }
            onChange={(e) =>
              actionType === "login"
                ? setLoginData({ ...loginData, username: e.target.value })
                : setRegisterData({ ...registerData, username: e.target.value })
            }
            required
          />

          {actionType === "register" && (
            <>
              <div className="text-gray-700">Email</div>
              <input
                type="email"
                className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                placeholder="john@example.com"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
              />
            </>
          )}

          <div className="text-gray-700">Password</div>
          <input
            type="password"
            className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            placeholder="Enter your password"
            value={
              actionType === "login"
                ? loginData.password
                : registerData.password
            }
            onChange={(e) =>
              actionType === "login"
                ? setLoginData({ ...loginData, password: e.target.value })
                : setRegisterData({ ...registerData, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {actionType === "login" ? "Login" : "Register"}
          </button>

          <button
            type="button"
            className="mt-2 w-full text-blue-500 underline"
            onClick={() => {
              setLogin(!login);
              setActionType(login ? "register" : "login");
            }}
          >
            {actionType === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Landing;
