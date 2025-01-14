import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

//get messages btw 2 users
router.get("/:id", protectRoute, getMessages);

//to send msgs
router.post("/send/:id", protectRoute, sendMessage);

export default router;
