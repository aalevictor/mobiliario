import { NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";

export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const smtpHost = process.env.MAIL_HOST;
    const smtpPort = process.env.MAIL_PORT;
    const smtpUser = process.env.MAIL_USER;
    const smtpPass = process.env.MAIL_PASS;

    const variables = {
      host: !!smtpHost,
      port: !!smtpPort,
      user: !!smtpUser,
      pass: !!smtpPass
    };

    // Verificar se todas as variáveis estão configuradas
    const configured = variables.host && variables.port && variables.user && variables.pass;

    // Verificar se o transporter está ativo
    const transporterActive = !!transporter;

    return NextResponse.json({
      configured,
      transporter: transporterActive,
      variables,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Erro ao verificar status SMTP:", error);
    
    return NextResponse.json(
      { 
        error: "Erro interno do servidor ao verificar status SMTP",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
