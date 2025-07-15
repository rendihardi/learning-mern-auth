import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({});
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // ⬅️ Tambahan

  const getAuthState = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/auth/is-verified`);
      if (data.success) {
        setIsLogin(true);
        getUserData();
      }
    } catch (error) {
      if (hasCheckedAuth) {
        // ⬅️ Cegah toast saat first load
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setHasCheckedAuth(true); // ⬅️ Sudah cek, next time boleh munculkan toast
    }
  };

  const getUserData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/get-user`, {
        credentials: "include",
      });
      const result = await response.json();
      setUserData(result.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLogin,
    setIsLogin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
