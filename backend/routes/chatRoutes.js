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
router.get("/private-messages/:from_user/:to_user", async (req, res) => {
  try {
    const { from_user, to_user } = req.params;
    const messages = await PrivateMessage.find({
      $or: [
        { from_user, to_user },
        { from_user: to_user, to_user: from_user },
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
    const { from_user, message } = req.body;
    const newMessage = new GroupMessage({ from_user, room, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error saving message", error });
  }
});

// Store private message
router.post("/private-messages", async (req, res) => {
  try {
    const { from_user, to_user, message } = req.body;
    const privateMessage = new PrivateMessage({ from_user, to_user, message });
    await privateMessage.save();
    res.status(201).json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

module.exports = router;