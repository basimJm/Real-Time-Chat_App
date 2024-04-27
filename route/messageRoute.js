const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getAllConversationsForUser,
  getConversationBetweenTowUsers,
} = require("../controller/messageController");

const { protect } = require("../controller/protectAuth");

router.route("/send/:receiverId").post(protect, sendMessage);
router.route("/all-conversations").get(protect, getAllConversationsForUser);
router.route("/:secondUserId").get(protect, getConversationBetweenTowUsers);

module.exports = router;
