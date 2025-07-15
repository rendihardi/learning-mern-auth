import React, { createContext, useContext } from "react";
import { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, setIsLogin, getUserData } = useContext(AppContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      setIsLogin(true); // dari context / state global

      await getUserData(); // ✅ Tunggu userData terisi dulu

      toast.success("Login berhasil!");
      navigate("/"); // ✅ Pindah halaman setelah data lengkap
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage); // akan tampil: "Invalid password", dsb
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        email,
        password,
      });

      toast.success("Register berhasil! Silakan login.");
      await getUserData();
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Sign up failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="items-center flex justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-10 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Sign Up" : "Sign In"}
        </h2>
        <p className="tesxt-sm text-center mb-6">
          {state === "Sign Up"
            ? "Create Your Account"
            : "Login to your account !"}
        </p>
        <form onSubmit={state === "Sign Up" ? handleSignUp : handleSignIn}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password ?
          </p>
          <button className=" cursor-pointer w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-center text-gray-400 mt-4 text-xs">
            Already have an account?{" "}
            <span
              onClick={() => setState("Sign In")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center text-gray-400 mt-4 text-xs">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
