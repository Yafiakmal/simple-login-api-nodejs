require("dotenv").config();
const jwt = require("jsonwebtoken");

// return object {access token, refresh token}
exports.generateTokens = async (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Payload must be a plain object');
  }

  const accessToken = jwt.sign(payload, process.env.JWT_AT_SECRET, {
    expiresIn: 180,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_RT_SECRET, {
    expiresIn: "7d",
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

