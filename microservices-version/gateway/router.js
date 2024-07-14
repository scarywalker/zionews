const router = require("express").Router();
const axios = require("axios");

const targetPort = (target) => {
  if (target == "dashboard") return "5000";
  if (target == "auth") return "6000";
  if (target == "news") return "7000";
  if (target == "chat") return "8000";
  if (target == "email") return "9000";
  else return null;
};

router.all("/:apiName/:path", async (req, res) => {
  const target = req.params.apiName;
  const port = targetPort(target);

  if (!port) return res.status(400).send("Invalid target");

  console.log(`Request to: ${target} on port: ${port}`);

  try {
    const url = `http://${target}:${port}/api/v1/${target}/${req.params.path}`;
    console.log(url);
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
    });
    console.log(`Response from ${target}: ${response.data}`);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
