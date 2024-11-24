const Chat = require("../models/Chat.js");
const Messages = require("../models/Messages.js");
const getReciverSocketId = require("../socket/socket.js");

const sendMessage = async (req, res) => {
  const { recieverId, message } = req.body;

  const senderId = req.user._id;

  if (!recieverId)
    return res.status(400).json({
      message: "Please give reciever id",
    });

  let chat = await Chat.findOne({
    users: { $all: [senderId, recieverId] },
  });

  if (!chat) {
    chat = new Chat({
      users: [senderId, recieverId],
      latestMessage: {
        text: message,
        sender: senderId,
      },
    });

    await chat.save();
  }

  const newMessage = new Messages({
    chatId: chat._id,
    sender: senderId,
    text: message,
  });

  await newMessage.save();

  await chat.updateOne({
    latestMessage: {
      text: message,
      sender: senderId,
    },
  });

  const reciverSocketId = getReciverSocketId(recieverId);

  if (reciverSocketId) {
    io.to(reciverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(newMessage);
};

const getAllMessages = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const chat = await Chat.findOne({
    users: { $all: [userId, id] },
  });

  if (!chat)
    return res.status(404).json({
      message: "No Chat with these users",
    });

  const messages = await Messages.find({
    chatId: chat._id,
  });

  res.json(messages);
};

module.exports = { sendMessage, getAllMessages };
