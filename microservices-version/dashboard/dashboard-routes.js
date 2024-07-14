const router = require("express").Router();
const db = require("./db");
const authorization = require("./middleware/authorization");

// get user that logged, useless till frontend

router.get("/", authorization, async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.user_id,
    ]);

    res.json(user.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// update user

router.put("/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE users SET user_name = $1, user_preferences = $2 where user_id = $3 returning *;",
      [req.body.name, req.body.preferences, req.params.id]
    );
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
