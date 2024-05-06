const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  messages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: [] },
  ],
  lastSenderName: {
    type: String,
  },
  lastMessage: {
    type: String,
  },
});

const conversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = conversationModel;
