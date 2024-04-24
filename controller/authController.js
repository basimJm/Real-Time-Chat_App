const user = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const jwtGenerator = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

exports.signUp = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  const currentUser = await user.findOne({ email });
  if (currentUser) {
    return next(new ApiError("user already exists", 404));
  }

  const newUser = new user({
    fullName,
    email,
    password,
  });

  const saveUser = await newUser.save();
  const token = jwtGenerator(saveUser._id);
  res.status(201).json({ status: 201, userData: saveUser, token: token });
});

exports.signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const currentUser = await user.findOne({ email }).select("-password");
  if (!currentUser || bcrypt.compare(currentUser.password, password)) {
    return next(new ApiError("invalid password or password", 404));
  }
  const token = jwtGenerator(currentUser._id);
  res.status(200).json({ status: 200, userData: currentUser, token: token });
});
