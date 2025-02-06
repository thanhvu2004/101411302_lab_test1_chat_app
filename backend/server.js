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

const users = {};

io.on("connection", (socket) => {
  // Group chat
  socket.on("joinRoom", ({ username, room }) => {
    users[socket.id] = username;
    socket.join(room);
    io.to(room).emit("message", {
      user: "System",
      text: `${username} has joined`,
      date_sent: new Date().toISOString(),
    });
  });

  socket.on("sendMessage", async ({ username, room, message }) => {
    const date_sent = new Date().toISOString();
    io.to(room).emit("message", { user: username, text: message, date_sent });
  });

  socket.on("typing", ({ username, room }) => {
    socket.broadcast.to(room).emit("typing", { username });
  });

  socket.on("stopTyping", ({ username, room }) => {
    socket.broadcast.to(room).emit("stopTyping", { username });
  });

  // Private chat
  socket.on("joinPrivateChat", ({ username, privateUsername }) => {
    const room = [username, privateUsername].sort().join("-");
    users[socket.id] = username;
    socket.join(room);
    io.to(room).emit("userJoined", { username });
  });

  socket.on("sendPrivateMessage", async ({ from_user, to_user, message }) => {
    const room = [from_user, to_user].sort().join("-");
    const date_sent = new Date().toISOString();
    io.to(room).emit("privateMessage", { from_user, message, date_sent });
  });

  socket.on("typing", ({ username, privateUsername }) => {
    const room = [username, privateUsername].sort().join("-");
    socket.broadcast.to(room).emit("typing", { username });
  });

  socket.on("stopTyping", ({ username, privateUsername }) => {
    const room = [username, privateUsername].sort().join("-");
    socket.broadcast.to(room).emit("stopTyping", { username });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit("message", {
      user: "System",
      text: `${username} has disconnected`,
      date_sent: new Date().toISOString(),
    });
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));