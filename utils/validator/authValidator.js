const { check } = require("express-validator");
const validateRules = require("../../meddilware/validatorMiddleware");
const userModel = require("../../model/userModel");

exports.signUpValidator = [
  check("fullName")
    .isLength({ min: 5 })
    .withMessage("your Name is too Short")
    .custom((fullName) =>
      userModel.findOne({ fullName: fullName }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This Name already in user"));
        }
      })
    ),

  check("email").isEmail().withMessage("Invalid Email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.password_confirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("password_confirm")
    .exists()
    .withMessage("Password confirmation required"),

  validateRules,
];

exports.signInValidator = [
  check("email").isEmail().withMessage("Invalid Email"),
  check("password").exists().withMessage("fill password field"),
  validateRules,
];
