const express = require("express");
const routes = require("./dashboard-routes.js");
const app = express();
const PORT = process.env.PORT2 || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/dashboard", routes);

app.listen(PORT, () => console.log(`dashboard on : ${PORT}`));
