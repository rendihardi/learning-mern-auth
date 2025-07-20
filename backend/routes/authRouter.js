import express from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  sendVerifyOtp,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  // googleLogin,
  // googleCallback,
  googlePopup,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-verified", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
// authRouter.get("/google", googleLogin);
// authRouter.get("/google/callback", googleCallback);
authRouter.post("/google/popup", googlePopup);

export default authRouter;
