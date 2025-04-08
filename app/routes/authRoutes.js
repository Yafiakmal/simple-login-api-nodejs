const express = require("express");
const registerController = require('../controllers/registerController')
const verifyController = require('../controllers/verifyController')
const loginController = require('../controllers/loginController')
const logout = require('../controllers/logoutController')
const validate = require('../middlewares/validationMiddleware');
const {checkVerifyToken} = require('../middlewares/verifyTokenMiddleware')
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 5, // Maksimal 5 request per IP
  message: { error: 'To Much Request, Try Again in 1 minute'},
  headers: true, // Tambahkan info rate limit di response header
});

const router = express.Router();

router.post("/register", limiter, validate.validateRegisterInput, checkVerifyToken ,registerController.register);

router.post("/login", limiter, validate.validateLoginInput, loginController.login);

router.get("/verify/:token", limiter, verifyController.verifyUserToken);

router.post("/logout", limiter, logout.logout)

// router.get("/protected", validate.validateHeader, accessToken.validateToken, userData.getProtectedDataById)
module.exports = router;
