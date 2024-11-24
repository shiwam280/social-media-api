const express = require("express");
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/", sendMessage);
router.get("/:id", getAllMessages);

module.exports = router;
