const express = require("express");

const router = express.Router();
const { protect } = require("../controller/protectAuth");
const {
  getAllUserExpectMe,
  getUserInfo,
} = require("../controller/usersController");

router.route("/").get(protect, getAllUserExpectMe);
router.route("/info").get(protect, getUserInfo);

module.exports = router;
