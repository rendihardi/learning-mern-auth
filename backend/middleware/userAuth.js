import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    (req.cookies && req.cookies.token) ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  if (!token) {
    return next(new ApiError("Unauthenticated Login Again", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return next(new ApiError("Unauthenticated", 401));
  }
};

export default userAuth;
