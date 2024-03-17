const express = require("express");

const router = express.Router();

const { signUp } = require("../controller/authController");

router.route("/signup").post(signUp);

module.exports = router;
