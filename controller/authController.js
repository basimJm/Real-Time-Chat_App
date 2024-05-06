const user = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const jwtGenerator = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const { firebaseConfig } = require("../config/firebaseConfig");

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const userModel = require("../model/userModel");

initializeApp(firebaseConfig);
const storage = getStorage();

exports.signUp = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  let newUser;
  if (req.file) {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "       " + dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    const currentUser = await user.findOne({ email });
    if (currentUser) {
      return next(new ApiError("user already exists", 404));
    }

    newUser = new user({
      fullName,
      email,
      password,
      imageUrl: downloadURL,
    });
  } else {
    newUser = new user({
      fullName,
      email,
      password,
      imageUrl:
        "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
    });
  }

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

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

exports.isUserAuthrized = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const isUserExisit = await user.findById({ _id: userId });
  if (!isUserExisit) {
    next(new ApiError("user not authrized", 401));
  }
  res.status(200).json({ success: true, statusCode: 200 });
});
