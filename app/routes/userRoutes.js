const express = require("express");
const accessToken = require('../middlewares/accessTokenMiddleware');
const userData = require('../controllers/userDataController')
const validate = require('../middlewares/validationMiddleware');
const router = express.Router();

router.get('/user',
    validate.validateHeader,
    accessToken.validateToken, 
    userData.getProtectedDataById
);


module.exports = router;