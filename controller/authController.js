const user = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.signUp = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, confirmPassowrd } = req.body;

  const currentUser = await user.findOne({ email });
  if (currentUser) {
    return next(new ApiError("user already exists", 404));
  }
  if (password !== confirmPassowrd) {
    return next(new ApiError("invalid pass", 404));
  }
  const newUser = new user({
    fullName,
    email,
    password,
  });

  const saveUser = await newUser.save();

  res.status(201).json({ status: 201, userData: saveUser });
});
