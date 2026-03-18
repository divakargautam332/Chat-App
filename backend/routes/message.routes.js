import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Send message to a specific user
router.post("/send/:receiverId", authMiddleware, sendMessage);

// Get all messages between two users
router.get("/:receiverId", authMiddleware, getMessages);

export default router;
