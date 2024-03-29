import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";
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

export const getUserListing = async (req, res, next) => {
  const id = req.params.id;
  if (req.user.id != id) {
    return errorHandler(401, "Unauthorized Request");
  }

  try {
    const listings = await Listing.find({ userRef: req.user.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(errorHandler(401, "User not found"));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
