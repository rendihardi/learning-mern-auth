import React, { createContext, useState } from "react";

// ✅ Gunakan Vite env vars langsung
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ✅ Buat context
export const AppContext = createContext();
console.log("Backend URL:", backendUrl);

// ✅ Buat provider
export const AppContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({});

  const getUserData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/get-user`, {
        credentials: "include",
      });
      const result = await response.json();
      setUserData(result.data); // ✅ Ambil hanya bagian data-nya
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
