const nodemailer = require("nodemailer");

const { EMAIL_SENDER_USERNAME, EMAIL_SENDER_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_SENDER_USERNAME,
    pass: EMAIL_SENDER_PASSWORD,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendMail = async (options: MailOptions) => {
  await transporter.sendMail(options);
};
