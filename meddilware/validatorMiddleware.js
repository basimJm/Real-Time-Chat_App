const { validationResult } = require("express-validator");

const validateRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors });
  }
  next();
};

module.exports = validateRules;
