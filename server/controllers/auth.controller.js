import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
export const signUp = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};
