// src/routes/authRoutes.js
import { Router } from "express";
import {  login } from "../controllers/authController.js";

const router = Router();

// Map routes to controllers
// router.post("/signup", signup);
router.post("/login", login);

export default router;
