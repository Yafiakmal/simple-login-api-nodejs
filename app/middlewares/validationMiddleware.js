const { check, body, validationResult } = require("express-validator");
const createError = require("http-errors");

// Middleware untuk validasi register
const validateRegisterInput = [
  body("username")
    .notEmpty()
    .withMessage("Username harus diisi")
    .isLength({ min: 3 })
    .withMessage("Username minimal 3 karakter"),

  body("email")
    .notEmpty()
    .withMessage("Email harus diisi")
    .isEmail()
    .withMessage("Email tidak valid"),

  body("password")
    .notEmpty()
    .withMessage("Password harus diisi")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(createError(400, errors.array()))
      }
      next();
    },
];

// Middleware untuk validasi login
const validateLoginInput = [
  body("identifier")
    .notEmpty()
    .withMessage("Identifier harus diisi"),

  body("password").notEmpty().withMessage("Password harus diisi"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(400, errors.array()))
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
      return next(createError(400, errors.array()))
    }
    next();
  },
];

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateHeader,
};
