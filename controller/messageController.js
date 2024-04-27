const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const messageModel = require("../model/messagesModel");
const conversationModel = require("../model/conversationModel");

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const myId = req.user._id;
  const { message, senderName, receiverName } = req.body;

  let conversation = await conversationModel.findOneAndUpdate(
    {
      users: [myId.toString(), receiverId],
    },
    { lastSenderName: senderName, lastMessage: message },
    { new: true }
  );

  const usersIds = [myId.toString(), receiverId];
  const sortUsersIds = usersIds.sort();

  if (!conversation) {
    conversation = await conversationModel.create({
      users: sortUsersIds,
    });
    // return next(new ApiError("Couldn't create conversation", 503));
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

  await Promise.all([conversation.save(), newMessage.save()]);

  res.status(201).json({ status: 201, message: newMessage });
});

exports.getAllConversationsForUser = asyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const conversation = await conversationModel
    .find({
      users: { $in: [myId.toString()] },
    })
    .populate("messages");

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
      .populate("messages");

    if (!conversation) {
      return next(new ApiError("no conversation between this tow users", 404));
    }

    res.status(200).json({ conversation: conversation });
  }
);
