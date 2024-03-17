const express = require("express");

const router = express.Router();

const { sendMessage, getMessages } = require("../controller/messageController");

router.route("/send/:senderId/:receiverId").post(sendMessage);
router.route("/:senderId/:receiverId").get(getMessages);

module.exports = router;
