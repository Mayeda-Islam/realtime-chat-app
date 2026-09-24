import express from "express";

import {
  getConversations,
} from "../controllers/conversationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get(
  "/conversations",
  authMiddleware,
  getConversations
);

export default router;