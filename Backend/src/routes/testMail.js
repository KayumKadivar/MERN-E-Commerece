const express = require("express");
const { sendEmail } = require("../utils/sendEmail");

const router = express.Router();

router.post("/send-test-mail", async (req, res) => {
  try {
    await sendEmail({
      to: "kayumkadivar09@gmail.com",
      subject: "Test Email",
      text: "Hello! This is a test email",
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

module.exports = router;
