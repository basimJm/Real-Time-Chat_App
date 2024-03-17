const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const messageModel = require("../model/messagesModel");
const conversationModel = require("../model/conversationModel");
const { getReceiverSocketId } = require("../socket/socket");

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { senderId, receiverId } = req.params;
  const { message } = req.body;
  let conversation = await conversationModel.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await conversationModel.create({
      participants: [senderId, receiverId],
    });
  }

  const messageContent = {
    senderId,
    receiverId,
    message,
  };

  const newMessage = await messageModel.create(messageContent);

  conversation.messages.push(newMessage._id);

  await Promise.all([conversation.save(), newMessage.save()]);

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    // io.to(<socket_id>).emit() used to send events to specific client
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({ status: 201, message: newMessage });
});

exports.getMessages = asyncHandler(async (req, res, next) => {
  const { senderId, receiverId } = req.params;
  const conversation = await conversationModel
    .findOne({
      participants: [senderId, receiverId],
    })
    .populate("messages");

  if (!conversation) {
    return next(new ApiError("no conversation found for this users", 404));
  }
  res.status(200).json({ conversation: conversation });
});
