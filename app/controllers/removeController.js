require("dotenv").config();
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const debugServer = require("debug")("app:server");
const userModel = require("../models/userModel");
const authModel = require("../models/authModels");
const utils = require("../utils/tokens");

exports.remove = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { username } = req.data;
    // check user exist
    debugServer("identifier:", username);
    if (await userModel.checkUserExist(username)) {
      // check password benar
      if (await userModel.verifyPassword(username, password)) {
        // delete user
        const del = await userModel.deleteByUsernameAndEmail(username);
        res
          .clearCookie("refreshTokenRefresh", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/auth/refresh",
          })
          .clearCookie("refreshTokenLogout", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/auth/logout",
          });
        return res.status(200).json({
          status: "success",
          // message: `${JSON.stringify(del)} was successfully deleted`,
          message: `${del.username} was successfully deleted`,
          data: [],
        });
      } else {
        return next(createError(409, "invalid password"));
      }
    }
    return next(createError(409, "user not found"));
    // return res.status(200).json({});
  } catch (error) {
    return next(createError(500, `error deleting user ${error}`));
  }
};
