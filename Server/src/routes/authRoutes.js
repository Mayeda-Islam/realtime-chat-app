// src/routes/authRoutes.js
import { Router } from "express";
import {  login, logout, signup } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Map routes to controllers
router.post("/signup", signup);
router.post("/login", login);
router.post('/logout', authMiddleware, logout); 

export default router;
