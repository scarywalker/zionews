const { Pool } = require("pg");

const devConfig = {
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || "5432",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "zionet_db",
};

const pool = new Pool(devConfig);

module.exports = { query: (text, params) => pool.query(text, params) };

