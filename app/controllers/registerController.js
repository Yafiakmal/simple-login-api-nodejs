require('dotenv').config();
const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const mailer = require('../config/mailer')
const userModel = require("../models/userModel");
const utils = require("../utils/tokens")


exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    //CEK USERNAME EXIST DAN VERIFIED
    debugServer(`Looking for Exist User `)
    if (await userModel.checkUserExist(username)) {
      return next(createError(409, 'Username Already Exist'));
    } else if(await userModel.checkUserExist(email)){
      return next(createError(409, 'Email Already Exist'));
    }else {
      // delete user because it is not exist(not verified)
      debugServer(`Delete User ${username}, and Creating New Row`)
      await userModel.deleteByUsernameAndEmail(username, email)
      await userModel.createUser(username, email, password);
    }
    
    try {
      debugServer(`Sending verification Code to ${email}`)
      mailer.sendVerificationEmail(email, await utils.generateVerToken(email));

      return res.status(201).json({
        status: 'created',
        statusCode: 201,
        message: `Succesfully registered, Please verify your email ${email} to complete registration.`,
      });
    } catch (error) {
      debugServer("Terjadi kesalahan ketika mengirim email ! ", error);
      next(createError(500, "Unidentified Error While Sending Email"));  
    }

  } catch (error) {
    debugServer("Error creating user :", error);
    next(createError(500, "Unidentified Error While Creating User"));
  }
};

