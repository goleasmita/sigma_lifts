import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "goleasmita876@gmail.com",
  from: "goleasmita876@gmail.com", // verified
  subject: "Test SendGrid",
  text: "This is a test email",
};

sgMail
  .send(msg)
  .then(() => console.log("Email sent!"))
  .catch((err) => console.error("SendGrid error:", err.response?.body || err.message));
