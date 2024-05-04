const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  fcmToken: {
    type: String,
  },
  authToken: {
    type: String,
    default: "empty",
  },
  imageUrl: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
