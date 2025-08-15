import nodemailer from "nodemailer";

const smtpHost = process.env.MAIL_HOST;
const smtpPort = process.env.MAIL_PORT;
const smtpUser = process.env.MAIL_USER;
const smtpPass = process.env.MAIL_PASS;

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
  throw new Error(
    "As variáveis de ambiente do SMTP não estão definidas corretamente para conexão no SMTP."
  );
}

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: Number(smtpPort),
  // secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});
