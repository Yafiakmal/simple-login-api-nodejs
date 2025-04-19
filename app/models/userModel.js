const db = require("../config/db");
const bcrypt = require("bcrypt");
const debugDB = require("debug")("app:database");

// return object
exports.getUserData = async (identifier, columns = ["username", "email"]) => {
  debugDB("[getUserData]");
  if (!identifier) {
    throw new Error("Identifier (username or email) must be filled");
  }

  const selectedColumns = columns.join(", "); // Ubah array menjadi string "kolom1, kolom2"
  const query = `SELECT ${selectedColumns} FROM users WHERE username = $1 OR email = $1`;

  try {
    const result = await db.query(query, [identifier]);

    return result.rows[0];
  } catch (error) {
    debugDB("Error saat mengambil data user:", error);
    throw error;
  }
};

// return bool
exports.checkUserExist = async (identifier) => {
  debugDB("[checkUserExist]");
  if (!identifier) {
    throw new Error("Identifier(username or email) must be filled");
  }

  const query = `SELECT username FROM users WHERE (username = $1 OR email = $1) AND is_verified = true`;

  try {
    const result = await db.query(query, [identifier]);

    if (!result.rows[0]) {
      return false;
    }
    return true;
  } catch (error) {
    debugDB("Error While Check User Exist:", error);
    throw error;
  }
};

// return first object and insert user
exports.createUser = async (username, email, password) => {
  debugDB("[createUser]");
  if (!username || !email || !password) {
    throw new Error(`make sure parameters all are filled`);
  }
  try {
    const saltRounds = 10;
    const hpass = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (username, email, hpass) VALUES ($1, $2, $3) RETURNING username, email",
      [username, email, hpass]
    );
    // debugDB(`Creating user : `, result.rows[0])
    return result.rows[0];
  } catch (error) {
    debugDB(error.code);
    throw error;
  }
};

// return first object and delete user data
exports.deleteByUsernameAndEmail = async (identifier) => {
  debugDB("[deleteByUsernameAndEmail]");
  if (!identifier) {
    throw new Error(`make sure all parameters are filled`);
  }
  try {
    const res = await db.query(
      `DELETE FROM users WHERE (username=$1 OR email=$1) RETURNING *`,
      [identifier]
    );
    // debugDB(`Deleting user : `,res.rows[0]);
    return res.rows[0];
  } catch (error) {
    debugDB(`Error Deleting User : `, error);
    throw error;
  }
};

// return true
exports.changeVerifyStatusTrue = async (email) => {
  debugDB("[changeVerifyStatusTrue]");
  if (!email) {
    throw new Error(`make sure email are filled in parameter`);
  }
  try {
    const status = await db.query(
      "UPDATE users SET is_verified = TRUE WHERE email = $1 RETURNING is_verified",
      [email]
    );
    // debugDB(
    //   `${email} verified status changed to ${status.rows[0].is_verified}`
    // );
    return status.rows[0].is_verified;
  } catch (error) {
    throw error;
  }
};

// return bool is password match
exports.verifyPassword = async (identifier, password) => {
  debugDB("[verifyPassword]");
  if (!identifier || !password) {
    throw new Error(`make sure all parameters are filled`);
  }
  try {
    const result = await db.query(
      "SELECT hpass FROM users WHERE username = $1 OR email = $1",
      [identifier]
    );
    if (!result.rows[0]) {
      // throw new Error(`Can't Verify User ${identifier}, Not Found`);
      return false;
    }
    const isValid = await bcrypt.compare(password, result.rows[0].hpass);
    return isValid;
  } catch (error) {
    throw error;
  }
};
