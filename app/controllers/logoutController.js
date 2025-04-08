require("dotenv").config();
const debugServer = require("debug")("app:server");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const authModel = require("../models/authModels");

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshTokenLogout"];
    const isValid = jwt.verify(refreshToken, process.env.JWT_RT_SECRET);

    if (isValid) {
      // REVOKE REFRESH TOKEN DATABASE
      // const revoke =
      await authModel.revokeRefreshToken(refreshToken);

      // RESPONSE, CLEAR COOKIE CLIENT
      return res
        .clearCookie("refreshTokenLogut")
        .clearCookie("refreshTokenRefresh")
        .status(204)
        .end();
    }

    // RESPONSE, CLEAR COOKIE CLIENT
    res
      .clearCookie("refreshTokenLogout")
      .clearCookie("refreshTokenRefresh")
      .status(204)
      .end();
  } catch (error) {
    res
      .clearCookie("refreshTokenLogout")
      .clearCookie("refreshTokenRefresh")
    createError(409, "Token are not valid");
  }
};
