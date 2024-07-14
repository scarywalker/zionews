const express = require("express");
const routes = require("./router.js");
const app = express();
const PORT = process.env.PORT1 || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.listen(PORT, () => console.log(`gateway on : ${PORT}`));
