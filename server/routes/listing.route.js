import express from "express";
import { create, deleteListing } from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyUser, create);
router.delete("/delete/:id", verifyUser, deleteListing);

export default router;
