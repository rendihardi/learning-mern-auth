import userModel from "../models/usersModel.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    res.status(200).json({
      status: "Success",
      data: {
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
