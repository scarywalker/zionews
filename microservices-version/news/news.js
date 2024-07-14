const express = require("express");
const router = express.Router();
const db = require("./db");
const axios = require("axios");

// Get relevant news
router.get("/:id", async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    if (user.rowCount === 0) {
      return res.status(404).send("User not found");
    }

    const preferences = user.rows[0].user_preferences;
    const preferencesQuery = preferences.join(" OR ");
    const apiKey = "pub_48532a2edba99e0f0b8231aaccb2ae4a940bb";

    // Send immediate response to client
    res.status(202).send("Request accepted, processing...");

    // Perform background task
    processNews(req.params.id, apiKey, preferencesQuery);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

async function processNews(userId, apiKey, preferencesQuery) {
  try {
    const newsResponse = await fetch(
      `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${preferencesQuery}&language=en`
    );
    const news = await newsResponse.json();

    if (newsResponse.status !== 200) {
      console.log("News API error:", news);
      // Handle error communication, e.g., send error message to user
      return;
    }

    console.log("Fetched news:", news);

    const analyzedNews = await axios.post(
      `http://gateway:4000/api/v1/chat/${userId}`,
      { data: news }
    );

    await axios.post(
      `http://gateway:4000/api/v1/email/${userId}`,
      { data: analyzedNews.data }
    );
  } catch (error) {
    console.log("Error processing news:", error);
    // Handle error communication, e.g., send error message to user
  }
}

module.exports = router;
