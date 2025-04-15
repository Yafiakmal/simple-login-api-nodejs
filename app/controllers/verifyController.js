require("dotenv").config();
const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.verifyUserToken = async (req, res, next) => {
  try {
    const token = req.params.token;

    // CHECK TOKEN EXIST
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email } = decoded;

      // CHECK VERIFY TOKEN PAYLOAD VALID
      if (await userModel.checkUserExist(email)) {
        return res.clearCookie('verify').status(409).json({
          status: "error",
          data: null,
          errors: [
            {
              field: "email",
              email: email,
              message: "User email already verified",
            },
          ]
        });
      }

      // CHANGE USER VERIFIED STATUS
      if (await userModel.changeVerifyStatusTrue(email)) {
        res.status(200).clearCookie('verify').json({
          status: "success",
          data: [{
            email: email
          }],
          message: "Your Email, Verified Successfuly.",
        });
      }
    } else {
      next(createError(400, "Token are not filled"));
    }
  } catch (error) {
    debugServer("Verification error:", error);
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token Was Expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Invalid Token"));
    }
    next(createError(500, "Error verifying user's email verification token"));
  }
};
