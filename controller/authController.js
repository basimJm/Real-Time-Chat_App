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

  const userData = await newUser.save();
  const token = jwtGenerator(userData._id);
  userData.authToken = token;
  const saveUser = await userData.save();
  res.status(201).json({ status: 201, userData: saveUser, token: token });
});

exports.signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const currentUser = await user.findOne({ email });

  try {
    if (!currentUser || !bcrypt.compare(password, currentUser.password)) {
      return next(new ApiError("invalid email or password", 404));
    }
  } catch (err) {
    console.log(err);
  }

  const token = jwtGenerator(currentUser._id);

  currentUser.authToken = token;
  await currentUser.save();

  delete currentUser._doc.password;
  res.status(200).json({ status: 200, userData: currentUser, token: token });
});
