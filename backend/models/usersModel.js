import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    verifyOtp: {
      type: String,
      default: " ",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: " ",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    service: {
      type: String,
      default: "manual",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("user", userSchema);

export default userModel;
