import React, { useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const EmailVerify = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const { backendUrl, isLogin, setIsLogin, getUserData, userData } =
    useContext(AppContext);

  const inputRef = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDataArray = pastedData.split("");
    pastedDataArray.forEach((data, index) => {
      if (index < inputRef.current.length) {
        inputRef.current[index].value = data;
      }
    });
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join(""); // ini cukup, tidak perlu `join()` dua kali

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        {
          otp,
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (isLogin && userData?.isVerified) {
      navigate("/");
    }
  }, [isLogin, userData, navigate]);

  return (
    <div className="items-center flex justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-10 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={submitHandle}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h2 className="text-white text-2xl font-bold text-center mb-4">
          Email Verification OTP
        </h2>
        <p className="text-center mb-6 text-indigo-400">
          Enter the OTP sent to your email
        </p>
        <div className="flex justify-between mb-8 ">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 bg-[#333A5C] text-white text-center rounded-md text-xl"
                required
                ref={(el) => (inputRef.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              ></input>
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-br from-blue-600 to-purple-600 hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
