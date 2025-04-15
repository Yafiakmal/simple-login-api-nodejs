require("dotenv").config();
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const debugServer = require("debug")("app:server");
const userModel = require("../models/userModel");
const authModel = require("../models/authModels");
const utils = require("../utils/tokens");

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    debugServer(req.body)
    // const h = req.headers["authorization"];
    // const token = h && h.split(" ")[1];
    // debugServer("login at:", token);
    // let v = false;
    // if (token) {
    //   v = jwt.verify(token, process.env.JWT_AT_SECRET, (err, decoded) => {
    //     if (!err) {
    //       return true;
    //     }
    //     debugServer("v -true")
    //     return false;
    //   });
    //   if (v) {
    //     debugServer("sending already login");
    //     return res.status(204).json({
    //       status: "success",
    //       message: "you have already login",
    //       data: [],
    //     });
    //   }
    //   // try {
    //   //   const v = jwt.verify(token, process.env.JWT_AT_SECRET)
    //   //   debugServer("sending already login");
    //   //     return res.status(204).json({
    //   //       status: "success",
    //   //       message: "you have already login",
    //   //       data:[]
    //   //     });
    //   // } catch (error) {
    //   //   debugServer("token login tidak ada atau bermasalah")

    //   // }
    // }

    // CHECK USER EXIST
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

        // SET REFRESH HTTP-ONLY COOKIE
        // debugServer("expires cookie:", parseInt(process.env.JWT_RT_SECRET_EXPIN)*1000)
        res
          .cookie("refreshTokenRefresh", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/auth/refresh",
            maxAge: parseInt(process.env.JWT_RT_SECRET_EXPIN) * 1000, // 7 hari
          })
          .cookie("refreshTokenLogout", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/auth/logout",
            maxAge: parseInt(process.env.JWT_RT_SECRET_EXPIN) * 1000, // 7 hari]
          });
        res.status(200).json({
          status: "success",
          message: "You are login succesfully",
          data: [
            {
              token: tokens.accessToken,
              rtoken: tokens.refreshToken,
            },
          ],
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
      debugServer("ini")
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
