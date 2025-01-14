import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

//middleware to fetch the user details
app.use(express.json()); //it will allow to extract json data from the body
app.use(cookieParser()); //it will allow to parse the cookie

//Authentication route
app.use("/api/auth", authRoutes);

//messages route
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
