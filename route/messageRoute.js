const express = require("express");

const router = express.Router();
const { protect } = require("../controller/protectAuth");
const {
  sendMessage,
  getAllConversationsForUser,
  getConversationBetweenTowUsers,
} = require("../controller/messageController");

router.route("/send/:receiverId").post(protect, sendMessage);
router.route("/all-conversations").get(protect, getAllConversationsForUser);
router.route("/:secondUserId").get(protect, getConversationBetweenTowUsers);

module.exports = router;
