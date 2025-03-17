require("dotenv").config();
const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.verifyUserToken = async (req, res, next) => {
  try {
    const token = req.params.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        const { email } = decoded;
        if(await userModel.checkUserExist(email)){
          return res.status(208).json({
            status: "Already Reported",
            statusCode: 201,
            message: "Your Email Already Verified",
          });
        }
        debugServer(
          `user dengan email ${email} registrasi dengan token :  ${token}`
        );

        if (await userModel.changeVerifyStatusTrue(email)){
          res.status(201).json({
            status: "success",
            statusCode: 201,
            message: "Your Email, Verified Successfuly.",
          });
        }
      

    } else {
      next(createError(400, "Bad Request"));
    }
  } catch (error) {
    debugServer("Verification error:", error);
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token Was Expired"));
    }
    if (error.name === 'JsonWebTokenError'){
      return next(createError(401, "Invalid Token"));
    }
    next(createError(500, "error verifying user's email verification token"));
  }
};
