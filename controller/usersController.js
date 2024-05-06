const user = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { model } = require("mongoose");

exports.getAllUserExpectMe = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const me = await user.findById(userId);
  if (!me) {
    return next(new ApiError("user not found", 404));
  }
  const allUsers = await user
    .find({ _id: { $ne: me._id } })
    .select("-password");

  res.status(200).json({ status: 200, users: allUsers });
});

exports.getUserInfo = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const me = await user.findById(userId).populate({
    path: "conversations",
    populate: {
      path: "users",
      model: "User",
    },
  });
  if (!me) {
    return next(new ApiError("user not found", 404));
  }

  res.status(200).json({ userData: me });
});
