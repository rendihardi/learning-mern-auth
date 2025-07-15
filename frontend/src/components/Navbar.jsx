import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, isLogin, backendUrl, setUserData, setIsLogin } =
    useContext(AppContext);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const VerifOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message);
    }
  };

  const HandleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        console.log("berhasil logout");
        setUserData(null);
        setIsLogin(false);
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div
      className="w-full flex justify-between items-center p-4 sm:p-6"
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData && isLogin ? (
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-black text-white relative group cursor-pointer">
          {userData.name?.[0]?.toUpperCase() || ""}
          {showDropdown && (
            <div className="absolute hidden group-hover:block text-black rounded pt-10 top-0 right-0 z-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm w-max">
                {!userData.isVerified && (
                  <li
                    onClick={VerifOtp}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={HandleLogout}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
