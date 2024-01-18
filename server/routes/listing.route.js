import express from "express";
import {
  create,
  deleteListing,
  getListing,
  getListings,
  edit,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyUser, create);
router.get("/get", getListings);
router.get("/:id", getListing);
router.post("/edit/:id", verifyUser, edit);
router.delete("/delete/:id", verifyUser, deleteListing);

export default router;
