import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
mongoose.connect(DB_CONNECTION_STRING);
mongoose.connection.once("connection", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", () => {
  console.log("Error while connecting to MongoDB");
});
app.use("/api/user/", userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
