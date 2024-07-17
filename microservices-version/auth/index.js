const express = require("express");
const cors = require("cors");
const routes = require("./auth-routes.js");
const app = express();
const PORT = process.env.PORT3 || 6000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", routes);

app.listen(PORT, () => console.log(`auth on : ${PORT}`));
