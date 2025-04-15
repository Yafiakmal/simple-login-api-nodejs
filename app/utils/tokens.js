require("dotenv").config();
const jwt = require("jsonwebtoken");

// return object {access token, refresh token}
exports.generateTokens = async (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Payload must be a plain object');
  }
  delete payload.exp;
  delete payload.iat;
  const accessToken = jwt.sign(payload, process.env.JWT_AT_SECRET, {
    expiresIn: parseInt(process.env.JWT_AT_SECRET_EXPIN),
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_RT_SECRET, {
    expiresIn: parseInt(process.env.JWT_RT_SECRET_EXPIN),
  });

  return { accessToken, refreshToken };
};


// return string token
exports.generateVerToken = async (email) => {
  if (!email || typeof email !== "string" || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw new Error("Invalid email format");
  }
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_SECRET_TIME),
  });
};

