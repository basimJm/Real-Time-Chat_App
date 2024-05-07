const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const messageModel = require("../model/messagesModel");
const conversationModel = require("../model/conversationModel");
const userModel = require("../model/userModel");

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const myId = req.user._id;
  const { message, senderName, receiverName } = req.body;

  const usersIds = [myId.toString(), receiverId];
  const sortUsersIds = usersIds.sort();

  let conversation = await conversationModel.findOneAndUpdate(
    {
      users: sortUsersIds,
    },
    { lastSenderName: senderName, lastMessage: message },
    { new: true }
  );

  if (!conversation) {
    conversation = await conversationModel.create({
      users: sortUsersIds,
      lastSenderName: senderName,
      lastMessage: message,
    });
  }

  const messageContent = {
    senderId: myId.toString(),
    receiverId,
    message,
    senderName,
    receiverName,
  };

  const newMessage = await messageModel.create(messageContent);

  conversation.messages.push(newMessage._id);

  users = await userModel.find({
    _id: { $in: [myId.toString(), receiverId] },
  });

  await Promise.all([conversation.save(), newMessage.save()]);

  users.map(async (user) => {
    if (!user.conversations.includes(conversation._id)) {
      user.conversations.push(conversation._id);
      await user.save();
    }
  });

  res.status(201).json({ status: 201, message: newMessage });
});

exports.getAllConversationsForUser = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const conversation = await conversationModel
    .find({
      users: { $in: [myId.toString()] },
    })
    .populate("users");

  if (!conversation) {
    return next(new ApiError("no conversation for this user", 404));
  }

  res.status(200).json({ conversation: conversation });
});

exports.getConversationBetweenTowUsers = asyncHandler(
  async (req, res, next) => {
    const { secondUserId } = req.params;
    const myId = req.user._id;

    const usersIds = [myId.toString(), secondUserId];
    const sortUsersIds = usersIds.sort();

    const conversation = await conversationModel
      .findOne({
        users: sortUsersIds,
      })
      .populate("messages")
      .populate("users");

    if (!conversation) {
      return next(new ApiError("no conversation between this tow users", 404));
    }

    res.status(200).json({ conversation: conversation });
  }
);
