const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = (user_id) => {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, process.env.jwtSecret || "potato", { expiresIn: 3600 });
};

module.exports = jwtGenerator;
