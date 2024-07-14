const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const db = require("./db");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/:id", async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE user_id = $1", [
      req.params.id,
    ]);

    if (user.rowCount === 0) {
      return res.status(404).send("User not found");
    }

    const userEmail = user.rows[0].user_email;
    const userNews = req.body

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "The news you asked for",
      text: userNews,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Server Error");
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).send("Email sent");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
