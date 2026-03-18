import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

router.get("/all", authMiddleware, getAllUsers);


export default router;
