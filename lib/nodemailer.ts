import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";

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
  const port = Number(smtpPort);
  const env = process.env.ENVIRONMENT;
  
  // Para ambiente local, sempre usa SMTP
  if (env === 'local') {
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.warn("⚠️  Configuração SMTP incompleta para ambiente local");
      return null;
    }
    
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
  
  // Para produção, tenta sendmail primeiro, fallback para SMTP
  if (fs.existsSync('/usr/sbin/sendmail')) {
    console.log("✅ Usando sendmail local do sistema");
    return nodemailer.createTransport({
      sendmail: true,
      newline: "unix",
      path: "/usr/sbin/sendmail",
    });
  } else {
    console.warn("⚠️  Sendmail não encontrado, usando fallback SMTP");
    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      return nodemailer.createTransport({
        host: smtpHost,
        port: port,
        secure: port === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      console.error("❌ Nem sendmail nem SMTP configurados corretamente");
      return null;
    }
  }
}

export const transporter = createTransporter();
