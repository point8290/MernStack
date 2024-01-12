import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.status(200).json({ message: "Hello World" });
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  if (req.user.id != id) {
    return errorHandler(401, "Unauthorized Request");
  }

  try {
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ user: rest });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  if (req.user.id != id) {
    return errorHandler(401, "Unauthorized Request");
  }

  try {
    await User.findByIdAndDelete(id);
    res
      .clearCookie("access-token")
      .status(200)
      .json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};
