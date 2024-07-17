const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) return res.status(401).json("Not Authorized");
    const payload = jwt.verify(jwtToken, process.env.jwtSecret || "potato");
    req.user = payload.user;
    console.log(`Authorized ${jwt}`)
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json("Not Authorized");
  }
};
