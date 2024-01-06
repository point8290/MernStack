import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const dbUser = await User.findOne({ email });
    if (dbUser) {
      const user = await bcryptjs.compare(password, dbUser.password);
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        const { password: pass, ...rest } = dbUser._doc;
        res
          .cookie("access-token", token, { httpOnly: true })
          .status(200)
          .json({ user: rest });
      } else {
        return next(errorHandler(401, "Wrong credentials"));
      }
    } else {
      return next(errorHandler(404, "User not found"));
    }
  } catch (error) {
    next(error);
  }
};
