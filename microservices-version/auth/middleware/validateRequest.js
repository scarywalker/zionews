const validateRequest = async (req, res, next) => {
  const { apiName } = req.params;
  const existingApis = ["dashboard", "chat", "email", "auth", "news"];
  const { preferences } = req.body;

  if (!existingApis.includes(apiName))
    return res.status(400).json({ error: "Invalid ApiName" });

  if (apiName === "dashboard" && req.method === "put") {
    if (
      !Array.isArray(preferences) ||
      preferences.length === 0 ||
      !preferences.every((item) => typeof item === "string")
    ) {
      return res
        .status(400)
        .json("Preferences must be a non-empty array of strings");
    }
  }


  next();
};

module.exports = validateRequest;
