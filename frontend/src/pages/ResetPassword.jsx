import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isEmailsent, setIsEmailsent] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpSubmited, setOtpSubmited] = React.useState(false);

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        {
          email,
        }
      );
      if (data?.success) {
        toast.success(data.message);
        setIsEmailsent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    setOtp(otpArray.join("")); // ini cukup, tidak perlu `join()` dua kali
    setOtpSubmited(true);
  };

  const onSubtmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword: password, // ✅ perbaiki typo dari newPassowrd
        }
      );
      if (data?.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
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
      {!isEmailsent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h2 className="text-white text-2xl font-bold text-center mb-4">
            Reset Password
          </h2>
          <p className="text-center mb-6 text-indigo-400">
            Enter Your Registered Email Address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="Email Id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className=" cursor-pointer w-full py-3 bg-gradient-to-br from-blue-600 to-purple-600 hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
            {" "}
            Submit
          </button>
        </form>
      )}

      {/* OTP FORM  */}
      {!otpSubmited && isEmailsent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h2 className="text-white text-2xl font-bold text-center mb-4">
            Reset Password OTP
          </h2>
          <p className="text-center mb-6 text-indigo-400">
            Enter the OTP sent to your email ID
          </p>
          <div className="flex justify-between mb-8">
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
                  onPaste={index === 0 ? handlePaste : null} // ✅ hanya input pertama
                />
              ))}
          </div>

          <button className=" cursor-pointer w-full py-3 bg-gradient-to-br from-blue-600 to-purple-600 hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
            Verify
          </button>
        </form>
      )}

      {/* Enter new password */}
      {otpSubmited && isEmailsent && (
        <form
          onSubmit={onSubtmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h2 className="text-white text-2xl font-bold text-center mb-4">
            New Password
          </h2>
          <p className="text-center mb-6 text-indigo-400">Enter New Password</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className=" cursor-pointer w-full py-3 bg-gradient-to-br from-blue-600 to-purple-600 hover:bg-gradient-to-br hover:from-blue-700 hover:to-purple-700 text-white rounded-full">
            {" "}
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
