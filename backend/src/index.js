import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
//del this bcoz we have already create one in socket.js file
//const app = express();

const PORT = process.env.PORT;

//middleware to fetch the user details
app.use(express.json()); //it will allow to extract json data from the body
app.use(cookieParser()); //it will allow to parse the cookie
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //allow cookies or auth headers to be sent with req
  })
);

//Authentication route
app.use("/api/auth", authRoutes);

//messages route
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
