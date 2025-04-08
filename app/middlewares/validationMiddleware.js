const { check, body, validationResult } = require("express-validator");
const debugServer = require('debug')('app:server')

// Middleware untuk validasi register
const validateRegisterInput = [
  body("username")
    .notEmpty()
    .withMessage("Username must be filled")
    .isLength({ min: 3 })
    .withMessage("Username must be more than 3 letters"),

  body("email")
    .notEmpty()
    .withMessage("Email must be filled")
    .isEmail()
    .withMessage("Please input email format"),

  body("password")
    .notEmpty()
    .withMessage("Password must be filled")
    .isLength({ min: 6 })
    .withMessage("Password must be more than 6 letters"),

    (err, req, res, next) => {
      const errors = validationResult(req);
      debugServer('Validation middleware')
      if (!errors.isEmpty()) {
        const error = []
        errors.errors.forEach((d) => {
          error.push({
            type: 'input validation',
            path: d.path,
            message: d.msg
          })
        })
        err = error
        debugServer('error : ', error)
      }
      next();
    },
];

// Middleware untuk validasi login
const validateLoginInput = [
  body("identifier")
    .notEmpty()
    .withMessage("Identifier must be filled"),

  body("password")
  .notEmpty()
  .withMessage("Password must be filled"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      const error = []
        errors.errors.forEach((d) => {
          error.push({
            type: 'input validation',
            path: d.path,
            message: d.msg
          })
        })
      
      return res
      .status(400)
      .json({
        status: "error",
        errors: error,
      });
    }
    next();
  },
];

// Middleware untuk validasi login
const validateHeader = [
  check("Authorization", "Authorization header is required").exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      const error = []
        errors.errors.forEach((d) => {
          error.push({
            type: 'input validation',
            path: d.path,
            message: d.msg
          })
        })

      return res
      .status(400)
      .json({
        status: "error",
        errors: error,
      });
    }
    next();
  },
];

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateHeader,
};
