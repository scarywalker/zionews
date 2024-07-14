const express = require("express");
const routes = require("./chat.js");
const app = express();
const PORT = process.env.PORT5 || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/chat", routes);

app.listen(PORT, () => console.log(`chat on : ${PORT}`));
