const express = require("express");

const router = express.Router();

const { upload } = require("../meddilware/upload/uploadProfileImage");
const { protect } = require("../controller/protectAuth");

const {
  signUp,
  signIn,
  isUserAuthrized,
} = require("../controller/authController");
const {
  signUpValidator,
  signInValidator,
} = require("../utils/validator/authValidator");

router
  .route("/signup")
  .post(upload.single("fileName"), signUpValidator, signUp);
router.route("/signin").post(signInValidator, signIn);
router.route("/check-token").post(protect, isUserAuthrized);

module.exports = router;
