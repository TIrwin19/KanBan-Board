import React from "react";

export const AvatarMembers = () => {
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


  const getRandomAvatars = () => {
    const shuffled = avatars.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map(id => `https://avatar.iran.liara.run/public/${id}`);
  };

  const randomAvatars = getRandomAvatars();

  return (
    <>
      <div className="flex -space-x-4 rtl:space-x-reverse">
        {randomAvatars.map((avatarUrl, index) => (
          <img
            key={index}
            className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
            src={avatarUrl}
            alt=""
          />
        ))}
      </div>
    </>
  );
};
