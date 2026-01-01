const transporter = require("../config/email");

exports.sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

