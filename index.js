require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const db = require("./db");
const PORT = process.env.PORT || 8080;

// middlewere

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/v1/auth", require("./routes/jwtAuth"));

app.use("/api/v1/dashboard", require("./routes/dashboard"));


// temp table creation temp table creation temp table creation temp table creation temp table creation temp table creation temp table creation

app.get("/api/v1", async (req, res) => {
  await db.query(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE TABLE IF NOT EXISTS users (user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_name VARCHAR(255) NOT NULL, user_email VARCHAR(255) NOT NULL, user_password VARCHAR(255) NOT NULL);'
  );
  res.sendStatus(200);
});

// temp table creation temp table creation temp table creation temp table creation temp table creation temp table creation temp table creation

app.listen(PORT, () => console.log(`server on : ${PORT}`));
