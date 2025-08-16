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
  return `
    <tr>
      <td style="background-color: ${styles.corPrimaria}; padding: 20px 30px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="vertical-align: middle;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 15px;">
                    <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; display: inline-block; text-align: center; line-height: 40px;">
                      <div style="width: 24px; height: 24px; background-color: ${styles.corDestaque}; border-radius: 50%; display: inline-block; line-height: 24px; margin-top: 8px;">
                        <span style="color: #ffffff; font-size: 12px; font-weight: bold;">SP</span>
                      </div>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600; line-height: 1.2;">Prefeitura de São Paulo</h1>
                    <p style="margin: 0; color: #ffffff; opacity: 0.8; font-size: 14px;">Concurso Mobiliário Urbano</p>
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
  return `
    <tr>
      <td style="position: relative; height: 250px; background: linear-gradient(135deg, ${styles.corTexto} 0%, #6b7280 100%); background-color: ${styles.corTexto};">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4);"></div>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" height="250">
          <tr>
            <td style="text-align: center; vertical-align: middle; padding: 40px 30px; position: relative; z-index: 1;">
              ${badge ? `
                <div style="display: inline-block; background-color: ${styles.corDestaque}; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; margin-bottom: 20px;">
                  ${badge}
                </div>
              ` : ''}
              
              <h2 style="margin: 0 0 16px 0; color: #ffffff; font-size: 32px; font-weight: bold; line-height: 1.2;">
                ${titulo}
              </h2>
              
              ${subtitulo ? `
                <p style="margin: 0 0 24px 0; color: #d1d5db; font-size: 18px; line-height: 1.4; max-width: 400px; margin-left: auto; margin-right: auto;">
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
  const cardsHtml = cards.map(card => `
    <tr>
      <td style="padding-bottom: 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
          <tr>
            <td style="vertical-align: top; padding-right: 16px; width: 48px;">
              <div style="width: 48px; height: 48px; background-color: ${styles.corSecundaria}; border-radius: 8px; text-align: center; line-height: 48px;">
                <div style="width: 24px; height: 24px; background-color: ${styles.corPrimaria}; border-radius: 4px; display: inline-block; margin-top: 12px;"></div>
              </div>
            </td>
            <td style="vertical-align: top;">
              <h4 style="margin: 0 0 8px 0; color: ${styles.corTexto}; font-size: 16px; font-weight: 600;">
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
  `).join('');

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
  return `
    <tr>
      <td style="background-color: #f3f4f6; padding: 30px; border-top: 1px solid #e5e7eb;">        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0 0 8px 0; color: ${styles.corTextoSecundario}; font-size: 14px;">
                Secretaria Municipal de Urbanismo e Licenciamento
              </p>
              <p style="margin: 0 0 8px 0; color: ${styles.corTextoSecundario}; font-size: 14px;">
                Rua São Bento, 405 - Centro
              </p>
              <p style="margin: 0 0 16px 0; color: ${styles.corTextoSecundario}; font-size: 14px;">
                CEP: 01011-100 | São Paulo | SP 
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
        titulo: 'Documentação',
        descricao: 'Mantenha seus documentos sempre atualizados para agilizar o processo.'
      },
      {
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
        titulo: 'Primeiros Passos',
        descricao: 'Acesse nosso portal e complete seu cadastro para começar.'
      },
      {
        titulo: 'Suporte',
        descricao: 'Nossa equipe está pronta para ajudar com qualquer dúvida.'
      }
    ]
  });
};
