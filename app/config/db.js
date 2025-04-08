const { Pool } = require('pg');
require('dotenv').config(); // Pastikan Anda menginstal dotenv untuk mengakses variabel lingkungan
const debugDB = require("debug")("app:database");


const pool = new Pool({
    user: process.env.DB_USER,          // Nama pengguna database
    host: process.env.DB_HOST,          // Host database ("db" karena docker compose nama service nya "db")
    database: process.env.DB_DATABASE,  // Nama database
    password: process.env.DB_PASSWORD,  // Kata sandi database
    port: process.env.DB_PORT || 5432,  // Port database (default 5432)
});

pool.connect()
    .then(() => debugDB("Database Connected Successfully!"))
    .catch(err => console.error("Database Connection Error:", err));


// Fungsi untuk menjalankan query
const query = (text_sql, params) => pool.query(text_sql, params);
// const client = (text_sql, params) => pool.query(text_sql, params);

// Ekspor pool dan fungsi query
module.exports = {
    // client,
    query,
    pool,
};