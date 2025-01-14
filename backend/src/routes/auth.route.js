import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

//we don't want to call this func for every user, they shud be authenticated so adding protectRoute(middleware)
//how it works: ifuser wants to update profilepic, first it will go into protectRoute to check if user is authenticated &
//if it is, then it will go to updateprofile func
//to update profilepic, we will need to upload our image somewhere (Cloudinary)
router.put("/update-profile", protectRoute, updateProfile);

// This will check if user is authenticated or not
// Validates user authentication.
router.get("/check", protectRoute, checkAuth);

export default router;
