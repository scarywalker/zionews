const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const db = require("./db");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_TRANSPORTER_HOST,
  port: process.env.MAIL_TRANSPORTER_PORT,
  secure: true,
  auth: {
    user: "gabrielgdischon@gmail.com",
    pass: "wlhb ddya pwga yiym",
  },
});

const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: "gabrielgdischon@gmail.com",
        ...mailOptions,
      },
      (err, info) => {
        err ? reject(err) : resolve(info);
      }
    );
  });
};

console.log("zzzzzzzzzzzzzzzzzzz", process.env.MAIL_SENDER_PASS);

router.post("/:id", async (req, res) => {
  console.log(
    "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
    transporter
  );
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    if (user.rowCount === 0) {
      return res.status(404).send("User not found");
    }

    const userEmail = user.rows[0].user_email;
    const userNews = req.body;

    await sendEmail({      
      to: userEmail,
      subject: "The news you asked for",
      text: this.toString(userNews),
    })

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
