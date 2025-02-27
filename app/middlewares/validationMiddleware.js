const { body, validationResult } = require('express-validator');

// Middleware untuk validasi register
const validateRegisterInput = [
  body('username')
    .notEmpty().withMessage('Username harus diisi')
    .isLength({ min: 3 }).withMessage('Username minimal 3 karakter'),
  
  body('email')
    .notEmpty().withMessage('Email harus diisi')
    .isEmail().withMessage('Email tidak valid'),
  
  body('password')
    .notEmpty().withMessage('Password harus diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Middleware untuk validasi login
const validateLoginInput = [
  body('email')
    .notEmpty().withMessage('Email harus diisi')
    .isEmail().withMessage('Email tidak valid'),
  
  body('password')
    .notEmpty().withMessage('Password harus diisi'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegisterInput,
  validateLoginInput
};