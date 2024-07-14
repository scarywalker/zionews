const router = require("express").Router();
const nodemailer = require("nodemailer");
const db = require("./db");
const authorization = require("./middleware/authorization");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourpassword",
  },
});

let mailOptions = {
  from: "youremail@gmail.com",
  to: "",
  subject: "The news you asked for",
  text: "",
};

router.get("/:id", authorization, async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    const userEmail = user.rows[0].user_email;
    mailOptions[to] = userEmail;

    const userNews = req.body;
    mailOptions[text] = userNews;

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Server Error");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("email sent");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
