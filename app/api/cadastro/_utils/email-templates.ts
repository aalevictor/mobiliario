/**
 * Sistema modularizado de templates de email seguindo a identidade visual do projeto
 * Cores principais: #A5942B (dourado), #F3F9E7 (verde claro), #7874C1 (roxo), #3B2D3A (marrom escuro)
 */

interface EmailTemplateProps {
  nome?: string;
  titulo?: string;
  subtitulo?: string;
  conteudoPrincipal?: string;
  conteudoSecundario?: string;
  botaoTexto?: string;
  botaoUrl?: string;
  mostrarCards?: boolean;
  cardsPersonalizados?: Array<{
    icone?: string;
    titulo: string;
    descricao: string;
  }>;
}

interface EmailStyles {
  corPrimaria: string;
  corSecundaria: string;
  corFundo: string;
  corTexto: string;
  corTextoSecundario: string;
  corDestaque: string;
}

const styles: EmailStyles = {
  corPrimaria: '#A5942B',
  corSecundaria: '#F3F9E7', 
  corFundo: '#f9fafb',
  corTexto: '#3B2D3A',
  corTextoSecundario: '#6b7280',
  corDestaque: '#7874C1'
};

/**
 * Componente do cabeçalho com logo da Prefeitura
 */
const gerarCabecalho = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://concursomoburb.prefeitura.sp.gov.br';
  
  return `
    <tr>
      <td style="background: linear-gradient(135deg, ${styles.corPrimaria} 0%, ${styles.corDestaque} 100%); padding: 25px 30px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="vertical-align: middle;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 20px;">
                    <!-- Logo da Prefeitura com design melhorado -->
                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 50%; display: inline-block; text-align: center; line-height: 60px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 3px solid #ffffff;">
                      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, ${styles.corDestaque} 0%, ${styles.corPrimaria} 100%); border-radius: 50%; display: inline-block; line-height: 36px; margin-top: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                        <span style="color: #ffffff; font-size: 14px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">SP</span>
                      </div>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; line-height: 1.2; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                      Prefeitura de São Paulo
                    </h1>
                    <p style="margin: 0; color: #ffffff; opacity: 0.95; font-size: 16px; font-weight: 500; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                      Concurso Mobiliário Urbano 2025
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

/**
 * Componente do banner hero personalizável
 */
const gerarBannerHero = (titulo: string, subtitulo?: string, badge?: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://concursomoburb.prefeitura.sp.gov.br';
  const heroImageUrl = `${baseUrl}/hero/pc/hero-b.png`;
  
  // Log para debugging
  console.log('🔍 Debug Banner Hero:', {
    baseUrl,
    heroImageUrl,
    envVar: process.env.NEXT_PUBLIC_APP_URL,
    titulo,
    subtitulo
  });
  
  return `
    <tr>
      <td style="background: linear-gradient(135deg, ${styles.corTexto} 0%, #6b7280 100%); background-color: ${styles.corTexto}; padding: 0; text-align: center;">
        <!-- Tabela principal com imagem de fundo -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-image: url('${heroImageUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: rgba(0, 0, 0, 0.6);">
              ${badge ? `
                <div style="display: inline-block; background-color: ${styles.corDestaque}; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                  ${badge}
                </div>
              ` : ''}
              
              <h2 style="margin: 0 0 16px 0; color: #ffffff; font-size: 32px; font-weight: bold; line-height: 1.2; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                ${titulo}
              </h2>
              
              ${subtitulo ? `
                <p style="margin: 0 0 24px 0; color: #ffffff; font-size: 18px; line-height: 1.4; max-width: 400px; margin-left: auto; margin-right: auto; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                  ${subtitulo}
                </p>
              ` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

/**
 * Componente de conteúdo principal
 */
const gerarConteudoPrincipal = (nome: string, conteudo: string): string => {
  return `
    <tr>
      <td style="padding: 40px 30px;">
        <h3 style="margin: 0 0 20px 0; color: ${styles.corTexto}; font-size: 24px; font-weight: bold;">
          Prezado(a) ${nome},
        </h3>
        
        <div style="margin: 0 0 30px 0; color: ${styles.corTextoSecundario}; font-size: 16px; line-height: 1.6;">
          ${conteudo}
        </div>
      </td>
    </tr>
  `;
};

/**
 * Componente de cards informativos
 */
const gerarCards = (cards: Array<{icone?: string; titulo: string; descricao: string}>): string => {
  const cardsHtml = cards.map((card, index) => {
    const iconColors = [
      `${styles.corPrimaria}`,
      `${styles.corDestaque}`,
      `${styles.corSecundaria}`,
      `${styles.corTexto}`
    ];
    const cardColor = iconColors[index % iconColors.length];
    
    return `
      <tr>
        <td style="padding-bottom: 20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: all 0.3s ease;">
            <tr>
              <td style="vertical-align: top; padding-right: 20px; width: 56px;">
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%); border-radius: 12px; text-align: center; line-height: 56px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  <div style="width: 28px; height: 28px; background: #ffffff; border-radius: 6px; display: inline-block; margin-top: 14px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                    <span style="color: ${cardColor}; font-size: 16px; font-weight: bold;">${card.icone || '📋'}</span>
                  </div>
                </div>
              </td>
              <td style="vertical-align: top;">
                <h4 style="margin: 0 0 12px 0; color: ${styles.corTexto}; font-size: 16px; font-weight: 600; line-height: 1.3;">
                  ${card.titulo}
                </h4>
                <p style="margin: 0; color: ${styles.corTextoSecundario}; font-size: 14px; line-height: 1.5;">
                  ${card.descricao}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <tr>
      <td style="padding: 0 30px 30px 30px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          ${cardsHtml}
        </table>
      </td>
    </tr>
  `;
};

/**
 * Componente de call-to-action
 */
const gerarCallToAction = (titulo: string, descricao: string, botaoTexto: string, botaoUrl: string): string => {
  return `
    <tr>
      <td style="padding: 0 30px 40px 30px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${styles.corSecundaria}; border-radius: 8px; padding: 30px; text-align: center;">
          <tr>
            <td>
              <h4 style="margin: 0 0 12px 0; color: ${styles.corTexto}; font-size: 18px; font-weight: 600;">
                ${titulo}
              </h4>
              <p style="margin: 0 0 20px 0; color: ${styles.corTextoSecundario}; font-size: 16px;">
                ${descricao}
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: ${styles.corDestaque}; border-radius: 8px; text-align: center;">
                    <a href="${botaoUrl}" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 8px;">
                      ${botaoTexto}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

/**
 * Componente do rodapé
 */
const gerarRodape = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://concursomoburb.prefeitura.sp.gov.br';
  
  return `
    <tr>
      <td style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 35px 30px; border-top: 3px solid ${styles.corPrimaria};">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="text-align: center;">
              <!-- Logos da Prefeitura e SPUrbanismo -->
              <div style="display: flex; justify-content: center; align-items: center; gap: 60px; margin-bottom: 30px; flex-wrap: wrap;">
                <!-- Logo da Prefeitura -->
                <div style="text-align: center; flex: 1; min-width: 200px; max-width: 250px;">
                  <div style="display: inline-block; text-align: center; margin-bottom: 12px;">
                    <img src="${baseUrl}/promocao/prefeitura.png" 
                         alt="Prefeitura de São Paulo" 
                         style="max-width: 100%; height: auto; max-height: 80px; display: block; margin: 0 auto;" />
                  </div>
                  <p style="margin: 0; color: ${styles.corTexto}; font-size: 13px; font-weight: 600; text-align: center;">
                    Prefeitura de São Paulo
                  </p>
                </div>
                
                <!-- Logo do SPUrbanismo -->
                <div style="text-align: center; flex: 1; min-width: 200px; max-width: 250px;">
                  <div style="display: inline-block; text-align: center; margin-bottom: 12px;">
                    <img src="${baseUrl}/promocao/spurbanismo.png" 
                         alt="SPUrbanismo" 
                         style="max-width: 100%; height: auto; max-height: 80px; display: block; margin: 0 auto;" />
                  </div>
                  <p style="margin: 0; color: ${styles.corTexto}; font-size: 13px; font-weight: 600; text-align: center;">
                    SPUrbanismo
                  </p>
                </div>
              </div>
              
              <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid ${styles.corPrimaria};">
                <p style="margin: 0 0 8px 0; color: ${styles.corTextoSecundario}; font-size: 14px; font-weight: 500;">
                  <strong>📍 Endereço:</strong> Rua São Bento, 405 - Centro
                </p>
                <p style="margin: 0 0 8px 0; color: ${styles.corTextoSecundario}; font-size: 14px; font-weight: 500;">
                  <strong>📮 CEP:</strong> 01011-100 | São Paulo | SP
                </p>
                <p style="margin: 0; color: ${styles.corTextoSecundario}; font-size: 14px; font-weight: 500;">
                  <strong>🌐 Portal:</strong> <a href="${baseUrl}" style="color: ${styles.corDestaque}; text-decoration: none; font-weight: 600;">concursomoburb.prefeitura.sp.gov.br</a>
                </p>
              </div>
              
              <p style="margin: 0; color: ${styles.corTextoSecundario}; font-size: 12px; opacity: 0.8;">
                Este é um email automático do sistema do Concurso Mobiliário Urbano 2025.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
};

/**
 * Estrutura base do email
 */
const gerarEstruturaBase = (conteudo: string): string => {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Prefeitura de São Paulo - Concurso Mobiliário Urbano</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${styles.corFundo}; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: ${styles.corTextoSecundario};">
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${styles.corFundo};">
        <tr>
            <td style="padding: 20px 0;">
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    ${conteudo}
                </table>
                
            </td>
        </tr>
    </table>
    
    <style type="text/css">
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            
            .mobile-padding {
                padding: 20px !important;
            }
            
            .mobile-text-center {
                text-align: center !important;
            }
            
            .mobile-font-size {
                font-size: 24px !important;
            }
            
            .mobile-hide {
                display: none !important;
            }
        }
        
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg {
                background-color: #1f2937 !important;
            }
            
            .dark-mode-text {
                color: #f9fafb !important;
            }
        }
    </style>
    
</body>
</html>`;
};

/**
 * Template base configurável
 */
export const gerarEmailTemplate = (props: EmailTemplateProps): string => {
  const {
    nome = 'Participante',
    titulo = 'Informações Importantes',
    subtitulo = 'Acompanhe as novidades do concurso',
    conteudoPrincipal = 'Obrigado por participar do nosso concurso!',
    botaoTexto = 'Acessar Portal',
    botaoUrl = `${process.env.NEXT_PUBLIC_APP_URL}`,
    mostrarCards = false,
    cardsPersonalizados = []
  } = props;

  let conteudo = '';
  
  // Cabeçalho
  conteudo += gerarCabecalho();
  
  // Banner Hero
  conteudo += gerarBannerHero(titulo, subtitulo, 'Concurso Mobiliário Urbano');
  
  // Conteúdo Principal
  conteudo += gerarConteudoPrincipal(nome, conteudoPrincipal);
  
  // Cards (se habilitado)
  if (mostrarCards && cardsPersonalizados.length > 0) {
    conteudo += gerarCards(cardsPersonalizados);
  }
  
  // Call to Action
  conteudo += gerarCallToAction(
    'Precisa de mais informações?',
    'Visite nosso portal oficial ou entre em contato conosco',
    botaoTexto,
    botaoUrl
  );
  
  // Rodapé
  conteudo += gerarRodape();
  
  return gerarEstruturaBase(conteudo);
};

/**
 * Templates pré-definidos para casos específicos
 */

// Template de confirmação de inscrição
export const templateConfirmacaoInscricao = (nome: string): string => {
  return gerarEmailTemplate({
    nome,
    titulo: 'Inscrição Confirmada!',
    subtitulo: 'Sua participação no concurso foi registrada com sucesso',
    conteudoPrincipal: `
      <p>Sua inscrição no <strong>Concurso Mobiliário Urbano</strong> foi realizada com sucesso!</p>
      <p>Em breve, entraremos em contato com as próximas etapas do processo. Fique atento ao seu e-mail para acompanhar todas as atualizações.</p>
      <p>Agradecemos sua participação e desejamos boa sorte!</p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        icone: '📋',
        titulo: 'Documentação',
        descricao: 'Mantenha seus documentos sempre atualizados para agilizar o processo.'
      },
      {
        icone: '📅',
        titulo: 'Cronograma',
        descricao: 'Acompanhe o cronograma do concurso em nosso portal oficial.'
      }
    ],
    botaoTexto: 'Acessar Minha Área',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`
  });
};

// Template de notificação geral
export const templateNotificacao = (nome: string, titulo: string, mensagem: string): string => {
  return gerarEmailTemplate({
    nome,
    titulo,
    subtitulo: 'Informação importante sobre o concurso',
    conteudoPrincipal: mensagem,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

// Template de lembrete
export const templateLembrete = (nome: string, evento: string, data: string): string => {
  return gerarEmailTemplate({
    nome,
    titulo: 'Lembrete Importante',
    subtitulo: `Não esqueça: ${evento}`,
    conteudoPrincipal: `
      <p>Este é um lembrete sobre <strong>${evento}</strong> marcado para <strong>${data}</strong>.</p>
      <p>Certifique-se de estar preparado e não perca essa oportunidade!</p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        icone: '⏰',
        titulo: 'Prazo',
        descricao: `Evento marcado para: ${data}`
      },
      {
        icone: '📝',
        titulo: 'Preparação',
        descricao: 'Verifique se todos os documentos e materiais estão prontos.'
      }
    ],
    botaoTexto: 'Ver Cronograma',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}/#cronograma`
  });
};

// Template de boas-vindas
export const templateBoasVindas = (nome: string): string => {
  return gerarEmailTemplate({
    nome,
    titulo: 'Bem-vindo ao Concurso!',
    subtitulo: 'Estamos felizes em tê-lo conosco',
    conteudoPrincipal: `
      <p>Seja bem-vindo ao <strong>Concurso Mobiliário Urbano</strong> da Prefeitura de São Paulo!</p>
      <p>Aqui você encontrará todas as informações necessárias para participar e acompanhar o andamento do concurso.</p>
      <p>Desejamos sucesso em sua jornada!</p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        icone: '🚀',
        titulo: 'Primeiros Passos',
        descricao: 'Acesse nosso portal e complete seu cadastro para começar.'
      },
      {
        icone: '💬',
        titulo: 'Suporte',
        descricao: 'Nossa equipe está pronta para ajudar com qualquer dúvida.'
      }
    ]
  });
};

// Template de notificação de nova dúvida
export const templateNovaDuvida = (nome: string, email: string, pergunta: string): string => {
  return gerarEmailTemplate({
    nome: 'Equipe Administrativa',
    titulo: 'Nova Dúvida Recebida',
    subtitulo: 'Um participante enviou uma nova pergunta',
    conteudoPrincipal: `
      <p>Uma nova dúvida foi enviada através do portal do concurso:</p>
      
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 2px solid ${styles.corPrimaria}; border-radius: 12px; padding: 24px; margin: 24px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h4 style="margin: 0 0 16px 0; color: ${styles.corTexto}; font-size: 18px; font-weight: 600; text-align: center;">
          📋 Detalhes da Dúvida
        </h4>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #ffffff; border-radius: 8px; border-left: 4px solid ${styles.corDestaque};">
          <strong style="color: ${styles.corTexto}; display: block; margin-bottom: 4px;">👤 Nome:</strong>
          <span style="color: ${styles.corTextoSecundario}; font-size: 16px;">${nome}</span>
        </div>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #ffffff; border-radius: 8px; border-left: 4px solid ${styles.corPrimaria};">
          <strong style="color: ${styles.corTexto}; display: block; margin-bottom: 4px;">📧 Email:</strong>
          <span style="color: ${styles.corTextoSecundario}; font-size: 16px;">${email}</span>
        </div>
        
        <div style="margin-bottom: 16px; padding: 12px; background: #ffffff; border-radius: 8px; border-left: 4px solid ${styles.corSecundaria};">
          <strong style="color: ${styles.corTexto}; display: block; margin-bottom: 8px;">❓ Pergunta:</strong>
          <div style="color: ${styles.corTextoSecundario}; font-size: 15px; line-height: 1.5; padding: 8px; background: #f8fafc; border-radius: 6px;">
            ${pergunta}
          </div>
        </div>
        
        <div style="text-align: center; padding: 12px; background: ${styles.corSecundaria}; border-radius: 8px; margin-top: 16px;">
          <span style="font-size: 12px; color: ${styles.corTexto}; font-weight: 600;">
            🕐 <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { 
              timeZone: 'America/Sao_Paulo',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
      
      <p style="text-align: center; font-size: 16px; color: ${styles.corTexto}; font-weight: 500;">
        Esta dúvida foi automaticamente registrada no sistema e está aguardando resposta da equipe administrativa.
      </p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        icone: '⚡',
        titulo: 'Ação Necessária',
        descricao: 'Acesse o painel administrativo para responder esta dúvida o mais breve possível.'
      },
      {
        icone: '📚',
        titulo: 'Histórico',
        descricao: 'Todas as dúvidas e respostas ficam registradas no sistema para consulta futura.'
      },
      {
        icone: '🔔',
        titulo: 'Notificação',
        descricao: 'O participante será notificado automaticamente quando a dúvida for respondida.'
      }
    ],
    botaoTexto: 'Responder Dúvida',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}/duvidas`
  });
};
