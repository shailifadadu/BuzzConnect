//protectRoute middleware

import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    //check if there is token or not
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    //if token is there, than decode it using private key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    //now user will be in db if above conditions are checked
    const user = await User.findById(decoded.userId).select("-password"); //select everything except pass

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //now if every checks are passed, user is authenticated
    //add user field to req and call the next func
    req.user = user;
    next(); //updateProfile func will be called
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
