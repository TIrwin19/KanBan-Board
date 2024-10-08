import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/queries/authQuerie";

export default function Welcome() {
  const { loading, error, data } = useQuery(GET_USER);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("The fucking error fetching user data is :", error);
    return <p>Error fetching user data.</p>;
  }
  const username = data.getUser.username;

  return <div className="">{`WELCOME ${username.toUpperCase()}`}</div>;
}
