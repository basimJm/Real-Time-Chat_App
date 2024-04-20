const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://realtimechatapp-qjt9.onrender.com"],
    methods: ["GET", "POST"],
  },
});

exports.getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("user login");
  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", {
      message: message.text,
      senderId: message.senderId,
      receiverId: message.receiverId,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // console.log("a user connected", socket.id);

  // const userId = socket.handshake.query.userId;
  // if (userId != "undefined") userSocketMap[userId] = socket.id;

  // // io.emit() is used to send events to all the connected clients
  // io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // // socket.on() is used to listen to the events. can be used both on client and server side
  // socket.on("disconnect", () => {
  //   console.log("user disconnected", socket.id);
  //   delete userSocketMap[userId];
  //   io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // });
});

module.exports = { app, io, server };
