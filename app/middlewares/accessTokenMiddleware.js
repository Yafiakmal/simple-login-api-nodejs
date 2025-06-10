require("dotenv").config();
const debugServer = require("debug")("app:server");
const createError = require("http-errors");
const jwt = require('jsonwebtoken')

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    debugServer("[ValidateToken] token:", token)

    // CHECK ACCESS TOKEN PROVIDED
    if (!token) {
      return next(createError(401, `Access token not provided. User Have To Login First`))
    }

    // CHECK VALID ACCESS TOKEN
    const decoded = jwt.verify(token, process.env.JWT_AT_SECRET)
    req.data = decoded;
    debugServer("req.data:",req.data)
    next();
  } catch (error) {
    debugServer("[ValidateToken] Error:", error)
    if (error.name === "TokenExpiredError") {
      return next(createError(403, `Expired access token, please refresh the token`));
    }
    next(createError(500, `Unidentificated Error When Validate Token`))
  }
};

module.exports = { validateToken };
