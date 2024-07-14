const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
const db = require("./db");
const authorization = require("./middleware/authorization");

// create a model

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.2,
  maxTokens: 1000,
  verbose: true,
});

router.get("/:id", authorization, async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    const preferences = user.rows[0].user_preferences;
    const preferencesQuery = preferences.join(" and ");
    const articles = toString(req.body);

    const selection = await model.invoke(
      `analyze this list of articles: ${articles}, in order, list the 3 that best match my interests: ${preferencesQuery}, answer in a raw text formatted to json with their title description and url`
    );

    console.log(selection);

    res.status(200).send(selection)
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
