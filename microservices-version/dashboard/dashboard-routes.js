const router = require("express").Router();
const db = require("./db");

// get user that logged, useless till frontend

router.get("/:id", async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    res.json(user.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// update user

router.put("/update/:id/", async (req, res) => {
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
