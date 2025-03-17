require("dotenv").config();
const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const userModel = require("../models/userModel");
const authModel = require("../models/authModels");
const utils = require("../utils/tokens");

exports.login = async (req, res, next) => {
  // ===== MAIN =====
  try {
    const { identifier, password } = req.body;
    if (await userModel.checkUserExist(identifier)) {
      if (await userModel.verifyPassword(identifier, password)) {
        const payload = await userModel.getUserData(identifier, [
          "id_user",
          "username",
          "email",
        ]);
        // GENERATE TOKEN
        const tokens = await utils.generateTokens(payload);
        // STORE REFRESH TOKEN TO DATABASE
        await authModel.addRefreshToken(payload.id_user, tokens.refreshToken);

        // Set refresh token sebagai HTTP-only cookie
        res
          .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
            sameSite: "strict",
            path : '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
          })
          .json({
            status: "success",
            statusCode: 200,
            token: tokens.accessToken,
          });
      } else {
        return next(
          createError(
            409,
            "Credential Invalid, Please Check Your Input Credential"
          )
        );
      }
    } else {
      return next(
        createError(
          409,
          "Credential Invalid, Please Check Your Input Credential"
        )
      );
    }
  } catch (error) {
    debugServer("Error Proses Login... :", error);
    return next(createError(500, "Unidentified Error While Login User"));
  }
};