require("dotenv").config();
const debugServer = require("debug")("app:server");
const createError = require("http-errors");
const jwt = require('jsonwebtoken')

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "unauthenticated",
        statusCode: 401,
        message: `Access token not provided. User Have To Login First`

      });
    }
    // debugServer(`token : ${token}`)
    jwt.verify(token, process.env.JWT_AT_SECRET, (err, decoded) => {
      // debugServer(`Verify Token`)
      if (err) {
        return res.status(403).json({
          status: "Unauthorized",
          statusCode: 403,
          message: "Invalid or expired access token"
        });
      }
      // debugServer(`Fill Payload : ${JSON.stringify(decoded)}`)
      req.payload = decoded;
      next();
    });
  } catch (error) {
    debugServer(`Error Validate Accecc Token : ${error}`)
    next(createError(500, `Unidentificated Error When Validate Token`));
  }
};

module.exports = { validateToken };
