import nodemailer, { Transporter } from "nodemailer";

const smtpHost = process.env.MAIL_HOST;
const smtpPort = process.env.MAIL_PORT;
const smtpUser = process.env.MAIL_USER;
const smtpPass = process.env.MAIL_PASS;

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
  console.warn("⚠️  Variáveis de ambiente SMTP não configuradas. Email será desabilitado.");
  console.warn("   Configure MAIL_HOST, MAIL_PORT, MAIL_USER e MAIL_PASS no arquivo .env");
}

// Função para criar transporter com configuração robusta
function createTransporter(): Transporter | null {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return null;
  }

  const port = Number(smtpPort);
  const env = process.env.ENVIRONMENT;
  
  if (env === 'local') {
    return nodemailer.createTransport({
      host: smtpHost,
      port: port,
      secure: port === 465, // true para porta 465 (SSL), false para outras portas
      requireTLS: port === 587, // requer TLS para porta 587 (STARTTLS)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        // Não falha em certificados auto-assinados
        rejectUnauthorized: false,
        // Permite versões TLS mais antigas se necessário
        ciphers: 'SSLv3',
      },
      // Configurações adicionais para debugging
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development',
    });
  }
  
  return nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
  });
}

export const transporter = createTransporter();
