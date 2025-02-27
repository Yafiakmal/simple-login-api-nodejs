var createError = require("http-errors");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const debugServer = require('debug')('app:server')


const register = async (req, res, next) => {
  // ===== MIDDLEWARE =====

  // ======== MAIN ========
  const { username, email, password } = req.body;

  // Validasi input tidak boleh kosong
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    debugServer(`Validation Error!`)
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //CEK USERNAME EXIST DAN VERIFIED
    // const result = await userModel.getUsersByUsername(username)[0]
    // res.json([await userModel.getUsersByUsername(username)][0].length)
    debugServer(`Looking for Exist User `)
    if ([await userModel.getUsersByUsername(username)][0].length) {
      res.status(409).json({ error: "Username already exists" });
    } else {
      // CEK EMAIL EXIST AND VERIFIED
      if ([await userModel.getUsersByEmail(email)][0].length) {
        res.status(409).json({ error: "Email already exists" });
      } else {
        // HASH PASSWORD IN USER MODEL
        // CREATE NEW USER TO DB
        await userModel.deleteByUsernameAndEmail(username, email)
        await userModel.createUser(username, email, password);
      }
    }
    debugServer(`Sending verification Code`)
    res.status(200).json({msg:`We've send ${email} verify code, Please Verify Your Email`})
    // SENDING JWT CODE TO EMAIL

  } catch (error) {
    console.info("Error creating user :", error);
    next(createError(500, "Unidentified Error While Creating User"));
  }
};

module.exports = { register };
