require("dotenv").config();
const debugServer = require("debug")("app:server");
const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const authModel = require("../models/authModels");

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshTokenLogout"];
    const refreshToken2 = req.cookies["refreshTokenRefresh"];
    debugServer("[/logout] token:", refreshToken, refreshToken2)
    const isValid = jwt.verify(refreshToken, process.env.JWT_RT_SECRET);

    if (isValid) {
      debugServer("[/logout] valid cookie")
      await authModel.revokeRefreshToken(refreshToken);

      // RESPONSE, CLEAR COOKIE CLIENT
      // const refresh =["refreshTokenRefresh", {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   path: "/auth/refresh",
      // }]
      return res
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
      })
        .status(204)
        .end();
    }
    debugServer("[/logout] invalid cookie")
    // RESPONSE, CLEAR COOKIE CLIENT
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
      })
      .status(204)
      .end();
  } catch (error) {
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
    createError(409, "Token are not valid");
  }
};
