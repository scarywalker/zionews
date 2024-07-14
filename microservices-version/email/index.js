const express = require("express");
const routes = require("./email.js");
const app = express();
const PORT = process.env.PORT6 || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/email", routes);

app.listen(PORT, () => console.log(`email on : ${PORT}`));
