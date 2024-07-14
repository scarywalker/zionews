const express = require("express");
const routes = require("./news.js");
const app = express();
const PORT = process.env.PORT4 || 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/news", routes);

app.listen(PORT, () => console.log(`news on : ${PORT}`));
