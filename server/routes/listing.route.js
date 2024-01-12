import express from "express";
import { create } from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyUser, create);

export default router;
