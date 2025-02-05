const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const app = require("./App");

// Connect to MongoDB
connectDB();

// Use CORS middleware
app.use(cors());

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"],
  },
});

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    io.to(room).emit("message", {
      user: "System",
      text: `${username} has joined ${room}`,
      date_sent: new Date(),
    });
  });

  socket.on("sendMessage", async ({ username, room, message }) => {
    io.to(room).emit("message", {
      user: username,
      text: message,
      date_sent: new Date(),
    });
  });

  socket.on("typing", ({ username, room }) => {
    socket.broadcast.to(room).emit("typing", { username });
  });

  socket.on("stopTyping", ({ username, room }) => {
    socket.broadcast.to(room).emit("stopTyping", { username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));