const express = require("express");

const router = express.Router();

const { signUp, signIn } = require("../controller/authController");
const {
  signUpValidator,
  signInValidator,
} = require("../utils/validator/authValidator");

router.route("/signup").post(signUpValidator, signUp);
router.route("/signin").post(signInValidator, signIn);

module.exports = router;
