const router = require("express").Router();
const axios = require("axios");
const bcrypt = require("bcryptjs");
const db = require("./db");
const jwtGenerator = require("./utils/jwtGenerator");
const validInfo = require("./middleware/validInfo");
const authorization = require("./middleware/authorization");
const validateRequest = require("./middleware/validateRequest");

// registering route

router.post("/register", validInfo, async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;
    const user = await db.query("SELECT * FROM users WHERE user_email = $1;", [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const bcryptPassword = await bcrypt.hashSync(password, salt);
    const newUser = await db.query(
      "INSERT INTO users (user_name, user_email, user_password, user_preferences) values ($1, $2, $3, $4) RETURNING *;",
      [name, email, bcryptPassword, preferences]
    );
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.status(201).json({
      status: "success",
      data: {
        token,
        user_id: newUser.rows[0].user_id,
        user_name: newUser.rows[0].user_name,
        user_preferences: newUser.rows[0].user_preferences,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// login route

router.post("/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query("SELECT * FROM users WHERE user_email = $1;", [
      email,
    ]);

    if (user.rows.length === 0)
      return res.status(401).json("Password or Email is incorrect");

    const validPassword = await bcrypt.compareSync(
      password,
      user.rows[0].user_password
    );

    if (!validPassword)
      return res.status(401).json("Password or Email is incorrect");

    const token = jwtGenerator(user.rows[0].user_id);

    res.status(201).json({
      status: "success",
      data: {
        token,
        user_id: user.rows[0].user_id,
        user_name: user.rows[0].user_name,
        user_preferences: user.rows[0].user_preferences,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// verification to check if user is logged in frontend

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// handle validation everything that doesn't aim for auth, they all need authorization

router.all(
  "/:apiName/:path",
  validateRequest,
  authorization,
  async (req, res) => {
    console.log("b");
    const { apiName, path } = req.params;

    console.log(`validating request for ${apiName}/${path}`);

    try {
      const url = `http://gateway:4000/api/v1/${apiName}/${path}`;
      const response = await axios({
        method: req.method,
        url: url,
        data: req.body,
        headers: {
          token: req.get("token"),
          isValid: "true",
        },
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
