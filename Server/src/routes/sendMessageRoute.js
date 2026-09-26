import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/sendMessageController.js";

const router = express.Router();

// Protected route to send a message
router.post("/send-message", authMiddleware, sendMessage);
router.get("/conversations/:conversationId", authMiddleware, getMessages);

export default router;
