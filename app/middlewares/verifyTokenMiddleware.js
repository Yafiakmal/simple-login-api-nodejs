require("dotenv").config();
const debugServer = require("debug")("app:server");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const checkVerifyToken = async (req, res, next) => {
  try {
    debugServer("body: ", req.body);
    const token = req.cookies["verify"];
    // debugServer("Verify Token : ", token);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // CHECK ALREADY IN VERIFICATION PROCESS
      debugServer("decoded: ", decoded);
      if (decoded) {
        if (req.body.email === decoded.email) {
          return next(
            createError(
              400,
              `verification code are already sent to your email '${decoded.email}' please check your email, or wait for 2 minute`
            )
          );
        }
      }
    }
    // debugServer("Token Not In Cookie");
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next();
    }

    // debugServer(error);
    next(
      createError(500, "Internal Server Error While Validating Verify Token")
    );
  }
};

module.exports = { checkVerifyToken };
