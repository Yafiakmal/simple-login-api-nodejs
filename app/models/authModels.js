// const { rows } = require("pg/lib/defaults");
const db = require("../config/db");
const debugDB = require("debug")("app:database");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.addRefreshToken = async (id_user, token) => {
  if (!id_user && !token) {
    throw new Error("Parameter must be all filled");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_RT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000);

    // Menyisipkan refresh token ke dalam database
    const result = await db.query(
      "INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES($1, $2, $3)",
      [id_user, token, expiresAt]
    );
    return result.rowCount > 0; // Mengembalikan true jika berhasil disimpan
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token refresh telah kedaluwarsa.");
    }
    debugDB("Error saat menambahkan Token");
    throw error; // Melempar error lainnya
  }
};

// return true 
exports.revokeRefreshToken = async (token) => {
  if (!token) {
    throw new Error("Parameter must be all filled");
  }

  try {
    const result = await db.query(
      "UPDATE refresh_tokens SET revoked = true WHERE token = $1 RETURNING revoked",
      [token]
    );

    // Pastikan ada hasil sebelum mengakses `result.rows[0]`
    if (result.rows.length === 0) {
      throw new Error("Token not found or already revoked");
    }

    return result.rows[0].revoked;
  } catch (error) {
    console.error("Error revoking refresh token:", error.message);
    throw error;
  }
};


exports.checkRefreshTokenExist = async (token) => {
  if (!token) {
    throw new Error("Parameter must be all filled");
  }
  try {
    const result = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [token]
    );

    if(!result.rows[0]){
      return false
    }
    return !result.rows[0].revoked
  } catch (error) {
    throw error
  }
};
// exports.revokeRefreshToken = async()
