const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

const getReciverSocketId = (reciverId) => {
  return userSocketMap[reciverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUser", Object.keys(userSocketMap)); //[1,2,3,4]

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getReciverSocketId };
