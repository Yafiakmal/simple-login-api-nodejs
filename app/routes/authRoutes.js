const express = require("express");
const registerController = require('../controllers/registerController')
const verifyController = require('../controllers/verifyController')
const loginController = require('../controllers/loginController')
const logoutController = require('../controllers/logoutController')
const refreshController = require('../controllers/refreshTokenController')
const removeController = require('../controllers/removeController')
const validate = require('../middlewares/validationMiddleware');
const accessToken = require('../middlewares/accessTokenMiddleware');
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

router.post("/logout", logoutController.logout)

router.post("/refresh", limiter, refreshController.refresh)

router.post("/remove", accessToken.validateToken, validate.validateRemoveInput, removeController.remove)

// router.get("/protected", validate.validateHeader, accessToken.validateToken, userData.getProtectedDataById)
module.exports = router;
