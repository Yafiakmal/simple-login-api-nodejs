const db = require("../config/db");
const bcrypt = require("bcrypt");
const debugDB = require('debug')('app:database')

const getUsers = async () => {
  try {
    const res = await db.query("SELECT username, email FROM users", []);
    return res.rows;
  } catch (error) {
    console.info("Error saat mengambil user");
  }
};

const getUsersByUsername = async (username) => {
  try {
    const res = await db.query(
      "SELECT username, email FROM users WHERE username = $1 AND is_verified = true",
      [username]
    );
    return res.rows;
  } catch (error) {
    debugDB(`Error saat mengambil user info by username`);
  }
};

const getUsersByEmail = async (email) => {
  try {
    const res = await db.query(
      "SELECT username, email FROM users WHERE email = $1 AND is_verified = true",
      [email]
    );
    return res.rows;
  } catch (error) {
    debugDB(`Error saat mengambil user info by email`);
  }
};

const createUser = async (username, email, password) => {
  try {
    const saltRounds = 10;
    const hpass = await bcrypt.hash(password, saltRounds);
    const res = await db.query(
      "INSERT INTO users (username, email, hpass) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hpass]
    );
    return res.rows[0];
  } catch (error) {
    debugDB(error.code);
    throw error;
  }
};

const deleteByUsernameAndEmail = async (username, email) => {
  try {
    const res = await db.query(
      `DELETE FROM users WHERE (username=$1 OR email=$2) RETURNING *`,
      [username, email]
    );
    return res.rows[0];
  } catch (error) {
    debugDB(error.code);
    throw error;
  }
};

module.exports = {
  getUsers,
  createUser,
  getUsersByUsername,
  getUsersByEmail,
  deleteByUsernameAndEmail,
};
