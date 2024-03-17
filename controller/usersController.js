const user = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.getAllUserExpectMe = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const me = await user.findById(userId);
  if (!me) {
    return next(new ApiError("user not found", 404));
  }
  const allUsers = await user.find({ _id: { $ne: me._id } });

  res.status(200).json({ status: 200, users: allUsers });
});
