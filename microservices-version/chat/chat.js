const router = require("express").Router();
const dotenv = require("dotenv");
const { ChatOpenAI } = require("@langchain/openai");
const { z } = require("zod");
const { RunnableSequence } = require("@langchain/core/runnables");
const { StructuredOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const db = require("./db");
dotenv.config();

// create a model

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.2,
  maxTokens: 1000,
  verbose: true,
  apiKey: process.env.OPENAI_API_KEY,
});

const zodSchema = z.object({
  answer: z.string().describe("pick the three most suitable news for the user preferences, list title url and decription"),
  source: z
    .string()
    .describe(
      "source used to answer the user's question, should be a website."
    ),
});

// const parser = StructuredOutputParser.fromZodSchema(zodSchema);

const chain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(
    "analyze this list of articles, answer with their title description and url,{listOfArticles} and pick the top three most suited for this {preferences}.\n{format_instructions}\n"
  ),
  model,
]);

function formatNewsArticles(newsData) {
  if (newsData.status !== "success" || !Array.isArray(newsData.results)) {
    return "No valid news data found.";
  }

  return newsData.results
    .map((article) => {
      return (`Title: ${article.title}\nDescription: ${article.description}\nURL: ${article.link}`);
    })
    .join("\n\n");
}

console.log("ffffffffffffffffffffffffffffff", parser.getFormatInstructions());

router.post("/:id", async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    const preferences = user.rows[0].user_preferences;
    const preferencesQuery = preferences.join(" and ");
    console.log(11111111111111111111111111111111);
    const articles = formatNewsArticles(req.body);
    console.log(2222222222222222222222222222222222222222);
    const response = await chain.invoke({
      listOfArticles: `${articles}`,
      preferences: `${preferencesQuery}`,
      format_instructions: `do your best to make this
      article 1:...
      title1:...
      descrtiption1:...
      url1:....
      article 2:...
      title2:...
      descrtiption2:...
      url2:....
      article 3:...
      title3:...
      descrtiption3:...
      url3:....
      make sure to give me ALL IN A SINGLE STRING`,
    });
    console.log("zzzzzzzzzzzzzzz", { ...response });

    res.status(200).send({ ...response });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
