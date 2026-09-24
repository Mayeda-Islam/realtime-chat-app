import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { sendMessage } from "../controllers/sendMessageController.js";

const router = express.Router();

// Protected route to send a message
router.post("/send-message", authMiddleware, sendMessage);

export default router;
