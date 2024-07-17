module.exports = (req, res, next) => {

  const { email, name, password, preferences } = req.body;

  const validEmail = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  };

  if (req.path === "/register") {
    if (![email, name, password, preferences].every(Boolean)) {
      return res.status(400).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(400).json("Invalid Email");
    } else if (
      !Array.isArray(preferences) ||
      preferences.length === 0 ||
      !preferences.every((item) => typeof item === "string")
    ) {
      return res
        .status(400)
        .json("Preferences must be a non-empty array of strings");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(400).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(400).json("Invalid Email");
    }
  }

  next();
};
