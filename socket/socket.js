const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("firebase-admin");
$env: GOOGLE_APPLICATION_CREDENTIALS =
  "C:UsersALBATOOLDownloadschatappchat-app-socketio-71eba-firebase-adminsdk-lwlg4-c656e8b6c1.json";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const userToken =
  "foIh1cqaQhmI9wE8-eg4sc:APA91bE7X7EsOx6D_GiDmYM0_HtHkeEcIcjmGQ-A5c7vBzjBms3eyFnAa3O6ApvVZue6X7Rk0jN4KVTLuRKyFhlnfNtMMbCqmkdVw94c5KBWFvtKrVwfSINnnqnSmKi_y2oyxbUdWc45";

// Function to send notification to a specific user
async function sendTestNotification(title, body) {
  const payload = {
    notification: {
      title: title,
      body: body,
    },
    token: userToken, // Use the user's token here
  };

  admin
    .messaging()
    .send(payload)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

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
    sendTestNotification("new Chat", message.text);
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
