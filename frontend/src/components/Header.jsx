import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);
  console.log(userData.name); // "rendiarta"
  console.log(userData.isVerified); // false

  return (
    <div className="flex flex-col items-center mt-10 px-4 text-center">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex flex-col items-center text-xl sm:text-3xl font-medium mb-2">
        Hey {userData?.name || "Developer"}{" "}
        <img src={assets.hand_wave} alt="" className="w-8 aspect-square" />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-bold">Welcome to our app</h2>
      <p className="mb-4 max-w-md mt-4">
        Let's start with quick product tour and we will get back to you and
        runngin in no time
      </p>
      <button className="border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 cursor-pointer">
        Get Started
      </button>
    </div>
  );
};

export default Header;
