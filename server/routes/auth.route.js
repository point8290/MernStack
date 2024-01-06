import express from "express";
import { signIn, google, signUp } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/google", google);

export default router;
