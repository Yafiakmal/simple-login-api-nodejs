require("dotenv").config();
const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authModel = require("../models/authModels");
const utils = require("../utils/tokens");

exports.refresh = async (req, res, next) => {
  try {
    let isExist = false
    const refreshToken = req.cookies['refreshTokenRefresh'];
    
    if (refreshToken) {
       isExist = await authModel.checkRefreshTokenExist(refreshToken);
    }

    
    if (isExist) {
      debugServer("last token: ",refreshToken)
      const payload = jwt.verify(refreshToken, process.env.JWT_RT_SECRET);
      // REVOKE LATEST REFRESH TOKEN
      await authModel.revokeRefreshToken(refreshToken);

      // GENERATE & STORE NEW REFRESH TOKEN TO DATABASE
      const tokens = await utils.generateTokens(payload);
      await authModel.addRefreshToken(payload.id_user, tokens.refreshToken);

      // Set refresh token sebagai HTTP-only cookie
      debugServer("new token: ",tokens.refreshToken)
      // debugServer("expires:", parseInt(process.env.JWT_RT_SECRET_EXPIN)*1000)
      res
        .cookie("refreshTokenRefresh", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/auth/refresh",
          maxAge: parseInt(process.env.JWT_RT_SECRET_EXPIN)*1000, // 7 hari
        })
        .cookie("refreshTokenLogout", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/auth/logout",
          maxAge: parseInt(process.env.JWT_RT_SECRET_EXPIN)*1000, // 7 hari
        })
        .json({
          status: "success",
          message: "You are login succesfully",
          data: [
            {
              token: tokens.accessToken,
            },
          ],
        });
    }else{
      next(createError(401, "Token are not provided or expired"));
    }
  } catch (error) {
    debugServer("Error Refresh Token: ", error)
    next(createError(500, error));
  }
};
