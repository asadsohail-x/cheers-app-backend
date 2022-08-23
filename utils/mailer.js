import nodemailer from "nodemailer";

import { config } from "dotenv";
config({
  path: "./config.env",
});

const user = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

const transportManager = nodemailer.createTransport({
  services: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user,
    pass,
  },
});

export const sendMail = (
  to,
  html,
  subject = "Social Dating App",
  cb = (e) => {
    if (e) {
      console.log(e);
    }
  }
) => {
  const options = {
    from: user,
    to,
    subject,
    html,
  };
  transportManager.sendMail(options, cb);
};

export const getEmailBody = (OTP) => `

    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466A;text-decoration:none;font-weight:600">Social Dating App</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for using Social Dating App. Use the following OTP to recover your password.</p>
        <h2 style="background: #00466A;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
        <p style="font-size:0.9em;">Regards,<br />Social Dating App</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>your corporation</p>
            <p>Address</p>
            <p>Country</p>
        </div>
        </div>
    </div>

`;
