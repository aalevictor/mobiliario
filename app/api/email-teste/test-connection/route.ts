import { NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";

export async function POST() {
  try {
    // Verificar se o transporter está configurado
    if (!transporter) {
      return NextResponse.json(
        { error: "Servidor de email não configurado" },
        { status: 500 }
      );
    }

    // Testar a conexão SMTP
    try {
      await transporter.verify();
      
      console.log("✅ Conexão SMTP testada com sucesso");
      
      return NextResponse.json({
        success: true,
        message: "Conexão SMTP estabelecida com sucesso",
        timestamp: new Date().toISOString()
      });

    } catch (verifyError) {
      console.error("❌ Erro na verificação SMTP:", verifyError);
      
      return NextResponse.json(
        { 
          error: "Falha na verificação da conexão SMTP",
          details: verifyError instanceof Error ? verifyError.message : "Erro desconhecido"
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Erro interno ao testar conexão SMTP:", error);
    
    return NextResponse.json(
      { 
        error: "Erro interno do servidor ao testar conexão SMTP",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
