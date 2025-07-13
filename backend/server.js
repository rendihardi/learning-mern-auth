import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRouter.js";
import errorHandler from "./middleware/errorHandler.js";
import userRouter from "./routes/userRouter.js";

// Wajib paling atas sebelum import file lain yang pakai process.env
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

connectDB();
const allowedOrigins = ["http://localhost:5173"];

// ✅ Middleware yang umum dan aman digunakan dulu
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.urlencoded({ extended: true }));

// ✅ Routing
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
// app.use("/api/user", userRouter);

// ❗ Error handler harus diletakkan PALING BAWAH
app.use(errorHandler);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
