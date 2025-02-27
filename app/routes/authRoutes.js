const express = require("express");
const controller = require('../controllers/registerController')
const { validateRegisterInput, validateLoginInput } = require('../middlewares/validationMiddleware');

var router = express.Router();

router.post("/register", validateRegisterInput, controller.register);

router.post("/login", validateLoginInput,(req, res) => {
  res.status(500).json({ message: "ini api login" });
  // ===== MIDDLEWARE =====
  // VALIDATION
  // FORMAT SESUAI
  // PANjANG KARAKTER
  // Karakter Khusus
  // No Blank

  // XSS, Hapus atau encode karakter-karakter yang bisa menyebabkan XSS.
  // CSRF
  // Captcha

  // ===== MAIN =====
  // CEK ACCESS TOKEN COOKIE
  // JIKA VALID, REDIRECT TO HOME
  // JIKA TIDAK VALID, CEK REFRESH TOKEN
  // JIKA VALID, GENEREATE AT DAN RT, DAN REDIRECT TO HOME
  // JIKA TIDAK VALID, MASUK PROSES LOGIN

  // PROSES LOGIN
  // CEK INDENTIFIER(USERNAME/EMAIL) EXIST
  // SELECT username, email, hpass FROM users WHERE (username = $1 OR email = $2) AND hpass = $3 AND is_verified = true;
  // JIKA USERNAME/EMAIL ADA, MAKA COMPARE HASH PASSWORD
  // JIKA MATCH, GENERATE AT AND RT DAN REDIRECT
  // JIKA TIDAK, REPONSE INVALID CREDENTIAL
  // JIKA TIDAK ADA, RESPONSE INVALID CREDENTIAL
});

router.get("/verify/:token", (req, res) => {
  res.status(500).json({ message: "ini api verify" });
});
module.exports = router;
