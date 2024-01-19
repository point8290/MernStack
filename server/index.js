import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
mongoose.connect(DB_CONNECTION_STRING);
mongoose.connection.once("connection", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", () => {
  console.log("Error while connecting to MongoDB");
});

const __dirname = path.resolve();

app.use("/api/user/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/listing/", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist/")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
