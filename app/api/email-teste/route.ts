import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";
import { 
  templateConfirmacaoInscricao, 
  templateNotificacao, 
  templateLembrete, 
  templateBoasVindasParticipante,
  templateNovaDuvidaCoordenacao,
  gerarEmailTemplate
} from "@/app/api/cadastro/_utils/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      templateType, 
      emailDestino, 
      nome, 
      evento, 
      data, 
      titulo, 
      mensagem, 
      pergunta 
    } = body;

    // Validações básicas
    if (!emailDestino || !templateType) {
      return NextResponse.json(
        { error: "Email de destino e tipo de template são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o transporter está configurado
    if (!transporter) {
      return NextResponse.json(
        { error: "Servidor de email não configurado" },
        { status: 500 }
      );
    }

    // Gerar HTML do template baseado no tipo
    let html: string;
    let subject: string;

    switch (templateType) {
      case "confirmacao":
        html = templateConfirmacaoInscricao(nome || "Participante");
        subject = "Confirmação de Inscrição - Concurso Mobiliário Urbano 2025";
        break;
      
      case "boas-vindas":
        html = templateBoasVindasParticipante(nome || "Participante", "SENHAINICIAL", "MOB-2025-0000000000");
        subject = "Bem-vindo ao Concurso Mobiliário Urbano 2025";
        break;
      
      case "lembrete":
        html = templateLembrete(nome || "Participante", evento || "Evento", data || "Data");
        subject = `Lembrete: ${evento || "Evento"} - Concurso Mobiliário Urbano 2025`;
        break;
      
      case "notificacao":
        html = templateNotificacao(nome || "Participante", titulo || "Notificação", mensagem || "Mensagem");
        subject = `${titulo || "Notificação"} - Concurso Mobiliário Urbano 2025`;
        break;
      
      case "nova-duvida":
        html = templateNovaDuvidaCoordenacao(nome || "Participante", emailDestino, pergunta || "Pergunta");
        subject = "Nova Dúvida - Concurso Mobiliário Urbano 2025";
        break;
      
      case "personalizado":
        html = gerarEmailTemplate({
          nome: nome || "Participante",
          titulo: "Atualização Importante",
          subtitulo: "Novas diretrizes publicadas",
          conteudoPrincipal: `
            <p>Prezados participantes,</p>
            <p>Informamos que foram publicadas novas diretrizes para o Concurso Mobiliário Urbano 2025.</p>
            <p>As principais mudanças incluem:</p>
            <ul style="margin: 20px 0; padding-left: 20px;">
              <li>Prorrogação do prazo de inscrição</li>
              <li>Novos critérios de avaliação</li>
              <li>Atualização do cronograma</li>
            </ul>
          `,
          mostrarCards: true,
          cardsPersonalizados: [
            {
              icone: '📅',
              titulo: 'Prazo Estendido',
              descricao: 'Inscrições prorrogadas até 30 de abril de 2025'
            },
            {
              icone: '📋',
              titulo: 'Documentação',
              descricao: 'Verifique se seus documentos estão atualizados'
            },
            {
              icone: '💬',
              titulo: 'Suporte',
              descricao: 'Entre em contato em caso de dúvidas'
            }
          ],
          botaoTexto: 'Ver Novas Diretrizes',
          botaoUrl: 'https://exemplo.com/diretrizes'
        });
        subject = "Atualização Importante - Concurso Mobiliário Urbano 2025";
        break;
      
      default:
        return NextResponse.json(
          { error: "Tipo de template inválido" },
          { status: 400 }
        );
    }

    // Enviar email
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || "naoresponda-mobiliariourbano@spurbanismo.sp.gov.br",
      to: emailDestino,
      subject: subject,
      html: html,
    });

    console.log("✅ Email de teste enviado com sucesso:", {
      messageId: info.messageId,
      to: emailDestino,
      template: templateType,
      subject: subject
    });

    return NextResponse.json({
      success: true,
      message: "Email de teste enviado com sucesso",
      messageId: info.messageId
    });

  } catch (error) {
    console.error("❌ Erro ao enviar email de teste:", error);
    
    return NextResponse.json(
      { 
        error: "Erro interno do servidor ao enviar email",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
