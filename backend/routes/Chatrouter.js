const express = require("express");
let router = express.Router();
let User = require("../models/users");
let Message = require("../models/message");
const { default: mongoose } = require("mongoose");
router.get("/dashboard", async (req, res) => {
  let users = await User.find();
  res.status(200).json(users);
});

//all messages

router.get("/messages/:id", async (req, res) => {
  try {
    let { id } = req.params;

    // get all messages where this user is involved
    let messages = await Message.find({
      $or: [{ from: id }, { to: id }],
    }).sort({ timestamp: 1 });

    // group by friend id
    let conversations = {};

    messages.forEach((msg) => {
      // identify friendId (the other person in this message)
      console.log(msg.timestamp);
      let friendId =
        msg.from.toString() === id ? msg.to.toString() : msg.from.toString();

      if (!conversations[friendId]) {
        conversations[friendId] = [];
      }

      conversations[friendId].push({
        from: msg.from,
        to: msg.to,
        text: msg.text,
        timestamp: msg.timestamp,
        delivered: msg.delivered,
      });
    });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//friend chat
router.get("/chat/:id1/:id2", async (req, res) => {
  let { id1, id2 } = req.params;

  await Message.updateMany({ to: id1 }, { $set: { delivered: true } });

  // Find messages between id1 and id2
  let messages = await Message.find({
    $or: [
      { from: id1, to: id2 },
      { from: id2, to: id1 },
    ],
  }).sort({ timestamp: 1 }); // Sort by time if you have a 'timestamp' field

  messages = messages.map((msg) => ({
    id: msg.from,
    text: msg.text,
  }));

  res.status(200).json(messages || []);
});

router.get("/unread/:id", async (req, res) => {
  let { id } = req.params;

  let result = await Message.aggregate([
    { $match: { to: new mongoose.Types.ObjectId(id), delivered: false } },
    {
      $group: {
        _id: "$from",
        unreadCount: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(result);
});
module.exports = router;
