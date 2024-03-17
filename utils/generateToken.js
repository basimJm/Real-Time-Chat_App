const jwt = require("jsonwebtoken");

const jwtGenerator = (userId, res) => {
  jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};
