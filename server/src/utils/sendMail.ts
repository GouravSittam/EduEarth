import nodemailer from "nodemailer";

export default async function sendMail({
  to,
  subject,
  content,
}: {
  to: string;
  subject: string;
  content: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: content,
  });
}
