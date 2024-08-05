const nodemailer = require("nodemailer");

const accountMail = async (email, subject, text) => {
  console.log(email, "Coming Email");
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
        <h1>Please Use this OTP to Verify Your Account</h1>
        <h2><b>${text}</b></h2>
        `,
  };

  transport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      return res.status(404).json("Email Not Sent");
    }
    return res.status(200).json("Email Sent");
  });
};

module.exports = accountMail;
