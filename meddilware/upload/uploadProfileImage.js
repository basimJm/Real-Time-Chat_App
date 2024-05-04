const multer = require("multer");
const ApiError = require("../../utils/apiError");
// Setting up multer as a middleware to grab photo uploads
exports.upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  //   const filetypes = /jpeg|jpg|png|gif/;
  //   const mimetype = filetypes.test(file.mimetype);

  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    return cb(null, true);
  } else {
    cb(new ApiError("Error: Images only! (jpeg, jpg, png, gif"), 404);
  }
}
