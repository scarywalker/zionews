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
  const isValid = req.headers.isvalid === "true";
  const target = isValid  ? req.params.apiName : "auth";
  const port = targetPort(target);

  try {
    let url = `http://${target}:${port}/api/v1/${target}/${req.params.path}`;

    if (!isValid && req.params.apiName !== "auth") {
      url = `http://auth:6000/api/v1/auth/${req.params.apiName}/${req.params.path}`;
    }

    console.log(`requesting to :${url}`);


    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        token: req.get("token")
      },
    });


    console.log(`Response from ${target}: ${response.data}`);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;