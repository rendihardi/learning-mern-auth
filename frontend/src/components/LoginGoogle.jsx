import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
const LoginGoogle = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLogin, getUserData } = useContext(AppContext);

  const handleGooglePopup = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // 🔍 Log untuk cek apakah client ID terbaca
    console.log("🔍 Google Client ID:", clientId);
    console.log("🔍 Backend URL:", backendUrl);

    if (!clientId) {
      toast.error("Client ID Google tidak ditemukan (undefined)");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "email profile openid",
      callback: async (response) => {
        try {
          console.log("🔑 Access Token Response:", response);

          const { data } = await axios.post(
            `${backendUrl}/api/auth/google/popup`,
            {
              access_token: response.access_token,
            },
            { withCredentials: true }
          );

          console.log("📦 Response from backend:", data);

          if (data.success) {
            setIsLogin(true);
            await getUserData();
            toast.success("Login Google berhasil!");
            navigate("/");
          } else {
            toast.error("Login gagal");
          }
        } catch (err) {
          console.error("❌ Error during login:", err);
          toast.error("Terjadi kesalahan saat login");
        }
      },
    });

    console.log("📤 Requesting access token...");
    client.requestAccessToken(); // ⬅️ Munculkan popup
  };

  return (
    <button
      onClick={handleGooglePopup}
      className=" cursor-pointer w-full mt-4 py-2.5 rounded-full bg-white text-black font-medium flex items-center justify-center gap-2"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
    </button>
  );
};

export default LoginGoogle;
