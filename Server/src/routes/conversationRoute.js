import express from "express";

import {
  accessConversation,
  getConversations,
} from "../controllers/conversationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get(
  "/conversations",
  authMiddleware,
  getConversations
);
// Route to check or create a new private conversation room
router.post(
  "/access",
  authMiddleware,
  accessConversation
);
export default router;