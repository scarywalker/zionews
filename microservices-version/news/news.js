const router = require("express").Router();
const db = require("./db");
const authorization = require("./middleware/authorization");
const axios = require("axios")

// get relevant news

router.get("/:id", authorization, async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    const preferences = user.rows[0].user_preferences;
    const preferencesQuery = preferences.join(" OR ");
    const apiKey = "pub_48532a2edba99e0f0b8231aaccb2ae4a940bb";

    const response = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${preferencesQuery}&language=en`
    );
    const parsedResponse = await response.json();

    if (response.status !== 200) {
      console.log(parsedResponse);
      res.status(parsedResponse.status);
    } else {
      console.log(parsedResponse);
      res.status(200).send("Await for email");

      const analyzedNews = await axios({
        method: "get",
        url: `http://localhost:4000/api/v1/chat/${req.params.id}`,
        data: parsedResponse,
      })

      await axios({
        method: "get",
        url: `http://localhost:4000/api/v1/email/${req.params.id}`,
        data: analyzedNews,
      })


    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
