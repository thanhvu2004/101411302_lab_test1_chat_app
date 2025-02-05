const express = require("express");
const GroupMessage = require("../models/group_message");
const PrivateMessage = require("../models/private_message");

const router = express.Router();

// Fetch previous group messages
router.get("/messages/:room", async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await GroupMessage.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

// Fetch private messages between two users
router.get("/private-messages/:sender/:receiver", async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    const messages = await PrivateMessage.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching private messages", error });
  }
});

// Store group message
router.post("/messages/:room", async (req, res) => {
  try {
    const { room } = req.params;
    const { sender, message } = req.body;
    const groupMessage = new GroupMessage({ room, sender, message });
    await groupMessage.save();
    res.status(201).json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

// Store private message
router.post("/private-messages", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const privateMessage = new PrivateMessage({ sender, receiver, message });
    await privateMessage.save();
    res.status(201).json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

module.exports = router;