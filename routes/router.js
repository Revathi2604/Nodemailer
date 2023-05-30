const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");
const axios = require("axios");

// send mail and slack notification
router.post("/register", (req, res) => {
  const { email, name } = req.body;

  try {
    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sending Email With React And Nodejs",
      html: `
        <div style="font-family: Arial; font-size: 14px;">
          <p>Hello and welcome, ${name}!</p>
          <p>Thank you for choosing us. We appreciate your interest and look forward to connecting with you soon.</p>
          <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
        </div>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error" + error);
      } else {
        console.log("Email sent:" + info.response);
      }
    });

    // send slack notification
    const slackData = JSON.stringify({
      text: `New registration: ${name} - ${email}`,
    });
    const slackConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.SLACK_WEBHOOK_URL,
      headers: {
        "Content-type": "application/json",
      },
      data: slackData,
    };
    axios
      .request(slackConfig)
      .then((response) => {
        console.log("Slack notification sent.");
      })
      .catch((error) => {
        console.log("Error sending Slack notification:", error);
      });

    res.status(201).json({ status: 201 });
  } catch (error) {
    console.log("Error" + error);
    res.status(401).json({ status: 401, error });
  }
});

module.exports = router;
