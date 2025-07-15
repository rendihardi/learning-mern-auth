import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import userModel from "../models/usersModel.js";
import { transporter } from "../config/nodemailer.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ApiError("name, email, dan password harus diisi", 400));
  }

  try {
    // Cek apakah email sudah digunakan
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new ApiError("Email is already registered", 400));
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    // Kirim email verifikasi/selamat datang
    const mailOption = {
      from: process.env.MAIL_SENDER,
      to: email,
      subject: "Pendaftaran akun berhasil",
      text: `Selamat akun anda berhasil terdaftar dengan email: ${email}`,
    };

    try {
      await transporter.sendMail(mailOption);
    } catch (mailErr) {
      console.error("MAIL ERROR:", mailErr); // 👈 tambahkan ini
      return next(new ApiError("Gagal mengirim email. Coba lagi nanti.", 500));
    }

    // Simpan user ke database
    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    // Buat token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.ACCES_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    // Kirim response
    res.status(201).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ApiError("email dan password harus diisi", 400));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError("Email not found", 404));
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return next(new ApiError("Invalid password", 401));
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.ACCES_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      status: "Success",
      data: {
        user,
        accessToken: token,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(new ApiError(err.message, 400));
  }
};

export const sendVerifyOtp = async (req, res, next) => {
  try {
    const userId = req.userId; // ✅ langsung dari token

    const user = await userModel.findById(userId);
    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    if (user.isVerified) {
      return next(new ApiError("User already verified", 400));
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 jam
    await user.save();

    const mailOption = {
      from: process.env.MAIL_SENDER,
      to: user.email,
      subject: "Verifikasi akun",
      text: `Verifikasi akun Anda dengan kode OTP berikut: ${otp}`,
    };

    await transporter.sendMail(mailOption);

    res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim ke email",
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

export const verifyEmail = async (req, res, next) => {
  const { otp } = req.body;

  console.log("BODY:", req.body); // Debug: pastikan otp masuk
  const userId = req.userId; // ✅ ambil dari token

  if (!userId || !otp) {
    return next(new ApiError("OTP harus diisi", 400));
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    if (user.verifyOtp !== otp) {
      return next(new ApiError("Invalid OTP", 400));
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return next(new ApiError("OTP expired", 400));
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email berhasil diverifikasi",
      data: {
        user,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.userId,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

// Reset Password Reset OTP
export const sendResetOtp = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ApiError("Email is required", 400));
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 24 jam
    await user.save();
    const mailOption = {
      from: process.env.MAIL_SENDER,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Reset password Anda dengan kode OTP berikut: ${otp}`,
    };
    await transporter.sendMail(mailOption);
    res.status(200).json({
      status: "Success",
      message: "OTP berhasil dikirim ke email",
    });
  } catch (error) {}
};

// Reset user password
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return next(new ApiError("email, OTP dan newPassword harus diisi", 400));
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ApiError("Email not found", 404));
    }
    if (user.resetOtp !== otp) {
      return next(new ApiError("Invalid OTP", 400));
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return next(new ApiError("OTP expired", 400));
    }

    const hashPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    res.status(200).json({
      status: "Success",
      message: "Password berhasil direset",
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};
