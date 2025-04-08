require("dotenv").config();
const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const mailer = require("../config/mailer");
const userModel = require("../models/userModel");
const utils = require("../utils/tokens");
const {validationResult}=require("express-validator");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    debugServer("body: ",req.body)

    // CHECK USERNAME & EMAIL EXIST [VERIFIED]
    if (await userModel.checkUserExist(username)) {
      return next(createError(409, "Username Already Exist"));
    } else if (await userModel.checkUserExist(email)) {
      return next(createError(409, "Email Already Exist"));
    } else {
      await userModel.deleteByUsernameAndEmail(username, email);
      await userModel.createUser(username, email, password);
    }

    // SEND RESPONSE & EMAIL
    try {
      const token = await utils.generateVerToken(email);
      mailer.sendVerificationEmail(email, token);


      // res.clearCookie("verify")
      res.cookie("verify", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/register",
        maxAge: process.env.JWT_SECRET_TIME * 1000,
      });

      return res.status(201).json({
        status: "success",
        data: null,
        message: `Succesfully registered, Please verify your email ${email} to complete registration.`,
      });
    } catch (error) {
      debugServer("Error sending email ! ", error);
      return next(createError(500, "Unidentified Error While Sending Email"));
    }
  } catch (error) {
    debugServer("Error creating user :", error);
    next(createError(500, "Unidentified Error While Creating User"));
  }
};
