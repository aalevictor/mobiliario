import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message } = body;

    // Validações básicas
    if (!to) {
      return NextResponse.json(
        { error: "Email de destino é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o transporter está configurado
    if (!transporter) {
      return NextResponse.json(
        { 
          success: false,
          error: "Transporter de email não configurado",
          details: "Verifique as configurações SMTP ou sendmail"
        },
        { status: 500 }
      );
    }

    // Template HTML simples para teste
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Teste de Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #2c3e50; margin-bottom: 20px;">🧪 Teste de Email - Mobiliário Urbano</h1>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #27ae60; margin: 0;">✅ Sistema de Email Funcionando!</h2>
          </div>
          
          <p style="color: #34495e; line-height: 1.6;">
            ${message || 'Este é um email de teste enviado automaticamente durante o deploy do sistema.'}
          </p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">📊 Informações do Teste:</h3>
            <ul style="color: #6c757d;">
              <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
              <li><strong>Servidor:</strong> ${process.env.HOSTNAME || 'localhost'}</li>
              <li><strong>Ambiente:</strong> ${process.env.ENVIRONMENT || 'desenvolvimento'}</li>
              <li><strong>Transporter:</strong> ${transporter.transporter ? 'SMTP' : 'Sendmail'}</li>
            </ul>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
            Este é um email automático gerado pelo sistema de testes do Concurso Mobiliário Urbano 2025.
          </p>
        </div>
      </body>
      </html>
    `;

    // Enviar email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "naoresponda-mobiliariourbano@spurbanismo.sp.gov.br",
      to: to,
      subject: subject || `[TESTE] Sistema de Email - ${new Date().toLocaleString('pt-BR')}`,
      html: htmlContent,
      text: message || "Este é um email de teste do sistema Mobiliário Urbano."
    });

    const result = {
      success: true,
      message: "Email de teste enviado com sucesso",
      details: {
        messageId: info.messageId,
        to: to,
        subject: subject || `[TESTE] Sistema de Email - ${new Date().toLocaleString('pt-BR')}`,
        timestamp: new Date().toISOString(),
        transporter: transporter.transporter ? 'SMTP' : 'Sendmail'
      }
    };

    console.log("✅ Email de teste enviado:", result.details);

    return NextResponse.json(result);

  } catch (error) {
    console.error("❌ Erro ao enviar email de teste:", error);
    
    const errorDetails = {
      success: false,
      error: "Erro ao enviar email de teste",
      details: error instanceof Error ? error.message : "Erro desconhecido",
      timestamp: new Date().toISOString()
    };

    // Log mais detalhado para debug
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}

// Método GET para verificar status do sistema de email
export async function GET() {
  try {
    const status = {
      transporter: !!transporter,
      type: transporter ? (transporter.transporter ? 'SMTP' : 'Sendmail') : 'Não configurado',
      environment: process.env.ENVIRONMENT || 'development',
      from: process.env.EMAIL_FROM || 'Não configurado',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Status do sistema de email",
      status
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Erro ao verificar status do email",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    }, { status: 500 });
  }
}
