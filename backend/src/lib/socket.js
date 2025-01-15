import { Server } from "socket.io";
import http from "http";
import express from "express";
import { userInfo } from "os";

//create express app
const app = express();
//create the server
const server = http.createServer(app);
//create socket.io server
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173"] },
});

//helper function
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//used to store online users
//store it in format: {userId: socketId}
const userSocketMap = {};

//listen to any incoming connections
io.on("connection", (socket) => {
  console.log("A User connected", socket.id);

  //get the userId from frontend(authStore.js)
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //io.emit is used to send events to all connected clients
  //args-> name, keys
  //let everyone know user is online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A User disconnected", socket.id);
    delete userSocketMap[userId];
    //let everyone know that user is offline
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
