import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center  bg-[url('/bg_home.png')] bg-cover bg-center">
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
