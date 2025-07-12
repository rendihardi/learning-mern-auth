import express from "express";
import { getUser } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.get("/get-user", userAuth, getUser);

export default userRouter;
