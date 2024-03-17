const express = require("express");

const router = express.Router();

const { getAllUserExpectMe } = require("../controller/usersController");

router.route("/:userId").get(getAllUserExpectMe);

module.exports = router;
