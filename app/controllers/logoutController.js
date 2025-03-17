require("dotenv").config();
const debugServer = require("debug")("app:server");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const authModel = require("../models/authModels");

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    const isValid = jwt.verify(refreshToken, process.env.JWT_RT_SECRET);
    if (isValid) {
      //merevoke refresh token di database
      const revoke = await authModel.revokeRefreshToken(refreshToken);
      //menghapus refresh token di cookies
      return res.clearCookie("refreshToken").status(204).end();
    }
    res.clearCookie("refreshToken").status(204).end();
  } catch (error) {
    debugServer(`Error Logout : ${error}`)
    next(createError())
  }
};
