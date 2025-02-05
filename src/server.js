const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const app = require("./App");

// Connect to MongoDB
connectDB();

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    io.to(room).emit("message", {
      user: "System",
      text: `${username} has joined ${room}`,
    });
  });

  socket.on("sendMessage", async ({ username, room, message }) => {
    io.to(room).emit("message", { user: username, text: message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));