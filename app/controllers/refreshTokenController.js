require('dotenv').config();
const createError = require("http-errors");
const debugServer = require("debug")("app:server");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModels');
const utils = require("../utils/tokens");

exports.refresh = async (req, res, next)=>{
    const {refreshToken} = req.cookies['refreshToken']

    const isExist = await authModel.checkRefreshTokenExist(refreshToken);
    if(isExist){
        const payload = jwt.verify(refreshToken, process.env.JWT_RT_SECRET)
        await authModel.revokeRefreshToken(refreshToken);
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
    }


}

