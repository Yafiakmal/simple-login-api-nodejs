const express = require("express");
const registerController = require('../controllers/registerController')
const verifyController = require('../controllers/verifyController')
const loginController = require('../controllers/loginController')
const logout = require('../controllers/logoutController')
const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post("/register", validate.validateRegisterInput, registerController.register);

router.post("/login", validate.validateLoginInput, loginController.login);

router.get("/verify/:token", verifyController.verifyUserToken);

router.post("/logout", logout.logout)

// router.get("/protected", validate.validateHeader, accessToken.validateToken, userData.getProtectedDataById)
module.exports = router;
