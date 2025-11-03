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
  tipo?: "participante" | "coordenacao";
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
const gerarConteudoPrincipal = (nome: string, conteudo: string, tipo: "participante" | "coordenacao" = "participante"): string => {
  return `
    <tr>
      <td style="padding: 40px 30px;">
        <h3 style="margin: 0 0 20px 0; color: ${styles.corTexto}; font-size: 24px; font-weight: bold;">
          ${tipo === "participante" ? `Prezado(a) ${nome},` : `À Coordenação do Concurso,`}
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
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%); border-radius: 12px; text-align: center; display: table; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  <div style="width: 28px; height: 28px; background: #ffffff; border-radius: 6px; display: table-cell; vertical-align: middle; text-align: center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                    <span style="color: ${cardColor}; font-size: 16px; font-weight: bold; line-height: 1; display: inline-block;">${card.icone || '📋'}</span>
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
              <div style="text-align: center; margin-bottom: 30px;">
                <!-- Container dos logos com centralização precisa -->
                <div style="display: inline-block; text-align: center;">
                  <!-- Logo da Prefeitura -->
                  <div style="display: inline-block; text-align: center; margin-right: 60px; vertical-align: top;">
                    <img src="${baseUrl}/logos/smul_preto.png" 
                         alt="Prefeitura de São Paulo" 
                         style="max-width: 200px; height: auto; max-height: 80px; display: block;" />
                  </div>
                  
                  <!-- Logo do SPUrbanismo -->
                  <div style="display: inline-block; text-align: center; vertical-align: top;">
                    <img src="${baseUrl}/logos/spurbanismo_preto.png" 
                         alt="SPUrbanismo" 
                         style="max-width: 200px; height: auto; max-height: 80px; display: block;" />
                  </div>
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
    cardsPersonalizados = [],
    tipo = "participante"
  } = props;

  let conteudo = '';
  
  // Banner Hero
  conteudo += gerarBannerHero(titulo, subtitulo, 'Concurso Mobiliário Urbano');
  
  // Conteúdo Principal
  conteudo += gerarConteudoPrincipal(nome, conteudoPrincipal, tipo);
  
  // Cards (se habilitado)
  if (mostrarCards && cardsPersonalizados.length > 0) {
    conteudo += gerarCards(cardsPersonalizados);
  }
  
  // Call to Action
  conteudo += gerarCallToAction(
    'Precisa de mais informações?',
    'Visite nosso portal oficial',
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

// Template de notificação geral
export const templateFinalizar = (): string => {
  return gerarEmailTemplate({
    nome: "Pré-inscrito(a)",
    titulo: "Concurso do Mobiliário Urbano: Finalize sua inscrição!",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>Agradecemos seu interesse no concurso e esperamos que aproveite essa importante oportunidade de contribuir com novos projetos de Mobiliário Urbano para a Cidade de São Paulo.</p>
      <p>Assim, reforçamos que para o prosseguimento de sua inscrição, é necessário submeter via Plataforma Online (https://concursomoburb.prefeitura.sp.gov.br/) os documentos necessários para inscrição até o dia 15/09/2025, conforme consta do Cronograma (item 21 do Edital).</p>
      <p>Caso não apresente os documentos, sua inscrição será indeferida. Caso já tenha apresentado, é possível ainda fazer uma conferência, complementando-os se necessário, até a data informada.</p>
      <p>Fique atento aos Informes na Plataforma Online e no Diário Oficial da Cidade de São Paulo. Lá você encontra informações importantes sobre o concurso e pode acessar os blocos de resposta aos pedidos de esclarecimento, nos termos do item 7.2 do Edital nº 001/SP-URB/2025. Já foram publicados 2 blocos de respostas aos pedidos de esclarecimento.</p>
      <p>Portanto, até o dia <strong>15/09/2025</strong> você deverá submeter os documentos necessários para inscrição, conforme item 9.2 do Edital:</p>
      <p>•	Carta de Declarações Obrigatórias de pessoa física ou pessoa jurídica assinada, conforme item 10 do Edital e ANEXO I ou ANEXO II.</p>
      <p>•	Declaração de Participação na Equipe, em caso de inscrição em equipe, assinada pelos membros que a constituem, conforme ANEXO III.</p>
      <p>•	Prova de regularidade fiscal para com a Fazenda Nacional e relativa à Seguridade Social (INSS), que será efetuada mediante apresentação de certidão expedida conjuntamente pela Secretaria da Receita Federal do Brasil (RFB) e pela Procuradoria-Geral da Fazenda Nacional (PGFN), referente a todos os créditos tributários federais e à Dívida Ativa da União (DAU) por elas administrados;</p>
      <p>•	Prova de regularidade fiscal para com a Fazenda Municipal do domicílio ou sede da interessada expedida pelo órgão competente;</p>
      <p>•	Cadastro Informativo Municipal de São Paulo - CADIN.</p>
      <p>•	Comprovação de Registro ou Certidão de inscrição da pessoa física ou pessoa jurídica no Conselho de Arquitetura e Urbanismo - CAU ou no Conselho de Engenharia e Agronomia - CREA da região da sede da empresa.
      <p>No caso de Pessoa Jurídica, o RESPONSÁVEL TÉCNICO pelo projeto deverá estar vinculado à Pessoa Jurídica como integrante do quadro social, como empregado ou como contratado.</p>
      <p>De acordo com o item 12.3.1.2.1 do Edital, todos os documentos devem ser submetidos em formato PDF, não podendo ultrapassar 20Mb (vinte megabites) no total, e devem ser nomeados, conforme as NORMAS DE APRESENTAÇÃO DE DOCUMENTOS DE HABILITAÇÃO - Anexo IV do Edital.</p>
      <p>Depois de submeter a documentação, fique atento ao CRONOGRAMA e aos informes na PLATAFORMA DO CONCURSO, pois divulgaremos a lista dos IDs deferidos e indeferidos, nos termos do item 12.3.1.3 do Edital.</p>
      <p>Caso seu ID constar como DEFERIDO, você será considerado INSCRITO no concurso e estará apto para submeter sua proposta técnica em nível de Estudo Preliminar.</p>
      <p>Caso conste como INDEFERIDO, você poderá apresentar um recurso em até 3 dias após a publicação da lista. Neste caso, siga as orientações do item 12.3.1.4 do Edital.</p>
      <p>A publicação final dos IDs deferidos e indeferidos será no dia 03/10/2025.</p>
      <p>Observação: nos termos do item 21.2 do Edital, eventuais alterações no cronograma podem acontecer. Caso ocorram serão notificadas na Plataforma Online do Concurso e no Diário Oficial. Fique atento!</p>
      <a href="https://concursomoburb.prefeitura.sp.gov.br/">Acesse aqui a plataforma e submeta sua documentação.</a>
      <p>Desejamos sucesso em sua jornada!</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templateFinalizarNovo = (): string => {
  return gerarEmailTemplate({
    nome: "Pré-inscrito(a)",
    titulo: "Concurso do Mobiliário Urbano: Finalize sua inscrição!",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>Agradecemos seu interesse no concurso e esperamos que aproveite essa importante oportunidade de contribuir com novos projetos de Mobiliário Urbano para a Cidade de São Paulo.</p>
      <p>Assim, <strong>reforçamos que para o prosseguimento de sua inscrição, é necessário submeter via Plataforma Online (https://concursomoburb.prefeitura.sp.gov.br/) os documentos necessários para inscrição até o dia 22/09/2025, conforme consta da prorrogação do Cronograma (item 21 do Edital alterado, conforme Despacho publicado em 15 de setembro de 2025, página 435).</strong></p>
      <p>Caso não apresente os documentos, sua inscrição será indeferida. Caso já tenha apresentado, é possível ainda fazer uma conferência, complementando-os se necessário, até a data informada.</p>
      <p>Fique atento aos Informes na Plataforma Online e no Diário Oficial da Cidade de São Paulo. Lá você encontra informações importantes sobre o concurso e pode acessar os blocos de resposta aos pedidos de esclarecimento, nos termos do item 7.2 do Edital nº 001/SP-URB/2025.</p>
      <p>Portanto, até o dia <strong>22/09/2025</strong> você deverá submeter os documentos necessários para inscrição, conforme item 9.2 do Edital:</p>
      <p>•	Carta de Declarações Obrigatórias de pessoa física ou pessoa jurídica assinada, conforme item 10 do Edital e ANEXO I ou ANEXO II.</p>
      <p>•	Declaração de Participação na Equipe, em caso de inscrição em equipe, assinada pelos membros que a constituem, conforme ANEXO III.</p>
      <p>•	Prova de regularidade fiscal para com a Fazenda Nacional e relativa à Seguridade Social (INSS), que será efetuada mediante apresentação de certidão expedida conjuntamente pela Secretaria da Receita Federal do Brasil (RFB) e pela Procuradoria-Geral da Fazenda Nacional (PGFN), referente a todos os créditos tributários federais e à Dívida Ativa da União (DAU) por elas administrados;</p>
      <p>•	Prova de regularidade fiscal para com a Fazenda Municipal do domicílio ou sede da interessada expedida pelo órgão competente;</p>
      <p>•	Cadastro Informativo Municipal de São Paulo - CADIN.</p>
      <p>•	Comprovação de Registro ou Certidão de inscrição da pessoa física ou pessoa jurídica no Conselho de Arquitetura e Urbanismo - CAU ou no Conselho de Engenharia e Agronomia - CREA da região da sede da empresa.
      <p>No caso de Pessoa Jurídica, o RESPONSÁVEL TÉCNICO pelo projeto deverá estar vinculado à Pessoa Jurídica como integrante do quadro social, como empregado ou como contratado, devendo-se apresentar a documentação pertinente, conforme item 9.2.6.1 do Edital.</p>
      <p>De acordo com o item 12.3.1.2.1 do Edital, todos os documentos devem ser submetidos em formato PDF, não podendo ultrapassar 20Mb (vinte megabites) no total, e devem ser nomeados, conforme as NORMAS DE APRESENTAÇÃO DE DOCUMENTOS DE HABILITAÇÃO - Anexo IV do Edital.</p>
      <p>Depois de submeter a documentação, fique atento ao CRONOGRAMA e aos informes na PLATAFORMA DO CONCURSO, pois divulgaremos a lista dos IDs deferidos e indeferidos, nos termos do item 12.3.1.3 do Edital.</p>
      <p>Caso seu ID constar como DEFERIDO, você será considerado INSCRITO no concurso e estará apto para submeter sua proposta técnica em nível de Estudo Preliminar.</p>
      <p>Caso conste como INDEFERIDO, você poderá apresentar um recurso em até 3 dias após a publicação da lista. Neste caso, siga as orientações do item 12.3.1.4 do Edital.</p>
      <p>A primeira publicação dos IDs deferidos e indeferidos se dará até dia 30/09/2025 e a lista final até dia 10/10/2025.</p>
      <p>Observação: nos termos do item 21.2 do Edital, eventuais alterações no cronograma podem acontecer. Caso ocorram serão notificadas na Plataforma Online do Concurso e no Diário Oficial. Fique atento!</p>
      <a href="https://concursomoburb.prefeitura.sp.gov.br/">Acesse aqui a plataforma e submeta sua documentação.</a>
      <p>Desejamos sucesso em sua jornada!</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templatePrazoSuplementar = (): string => {
  return gerarEmailTemplate({
    nome: "Pré-inscrito(a)",
    titulo: "Abertura de período suplementar para submissão de documentos: AMANHÃ (sexta-feira, 26/09/2025) das 8h às 12h",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>A Coordenação do concurso recebeu algumas notificações acerca de possíveis falhas no sistema para a submissão de documentos no dia 22/09/2025, data final de inscrições e submissão de documentos.</p>
      <p>Após avaliação junto à Assessoria de Tecnologia (ATIC) da Secretaria de Urbanismo e Licenciamento (SMUL), a Coordenação do Concurso publicou na data de hoje (25/09/2025) no Diário Oficial da Cidade de São Paulo e nos <a href="https://concursomoburb.prefeitura.sp.gov.br/informes">Informes</a> da <a href="https://concursomoburb.prefeitura.sp.gov.br">Plataforma Digital Online do Concurso</a>, uma deliberação de prazo suplementar exclusivamente para envio dos documentos que por ventura possa ter sido prejudicado em razão do elevado número de solicitações processadas próximo ao horário limite e por eventuais problemas de comunicação ocasionados por quedas de rede elétrica e de internet, em consequência das chuvas e rajadas de vento ocorridas em 22/09/2025.</p>
      <p>O prazo suplementar, nos termos dos itens 11.7 e 11.7.1 do Edital nº 001/SP-URB/2025, se dará somente pelo período entre as <strong><span style="color: #FF0000;">8h e 12h do dia 26/09/2025</span>, exclusivamente para submissão de documentos novos no sistema, com datas de processamento e assinatura até 22/09/2025 às 23h59, não sendo autorizada a substituição ou supressão de quaisquer documentos já submetidos na plataforma.</strong></p>
      <p><strong>Qualquer pré-inscrito poderá apresentar a documentação, que deverá ser submetida preferencialmente via Plataforma Digital Online ou pelo e-mail <a href="mailto:concursomoburb.sp2025@spurbanismo.sp.gov.br">concursomoburb.sp2025@spurbanismo.sp.gov.br</a>. Caso seja enviado por e-mail, favor indicar no assunto seu código identificador (ID), com o formato MOB-2025-1234567890.</strong></p>
      <p>Confira a íntegra a deliberação nos <a href="https://concursomoburb.prefeitura.sp.gov.br/informes">Informes</a> da <a href="https://concursomoburb.prefeitura.sp.gov.br">Plataforma Digital Online do Concurso</a></p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templateListaInscritos = (): string => {
  return gerarEmailTemplate({
    nome: "Participante",
    titulo: "Divulgação da 1ª lista de IDs Deferidos e Indeferidos para Inscrição",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>Está disponível e nos <a href="https://concursomoburb.prefeitura.sp.gov.br/informes">Informes</a> da <a href="https://concursomoburb.prefeitura.sp.gov.br">Plataforma Digital Online do Concurso</a>, a <strong>1ª LISTA DE IDs DEFERIDOS E INDEFERIDOS PARA INSCRIÇÕES</strong>, nos termos do item 12.3.1.3 do Edital nº 001/SP-URB/2025.</p>
      <p>A lista também foi publicada no Diário Oficial da Cidade de São Paulo, indicando os despachos de deferimento e indeferimento para cada código identificador (ID), seguido das motivações para os casos de indeferimento.</p>
      <p>Na lista foram indicados:</p>
      <p><strong>1ª coluna:</strong> Número do ID;</p>
      <p><strong>2ª coluna:</strong> Documentos exigidos para inscrição; </p>
      <p><strong>3ª coluna:</strong> “Código da Documentação”, nos termos do anexo IV do Edital; </p>
      <p><strong>4ª coluna:</strong> “Situação do documento apresentado”, compreendendo as seguintes possibilidades:  </p>
      <ul style="margin-left: 20px;">
        <li><strong>Documento Adequado:</strong> quando o documento foi apresentado, conforme exigências constantes do Edital.</li>
        <li><strong>Documento Inadequado ou Insuficiente:</strong> quando o documento foi apresentado, mas com indicativo de irregularidade ou incompleto (sem assinatura, por exemplo).</li> 
        <li><strong>Documento não Apresentado:</strong> ausência do documento exigido </li>
        <li><strong>Não se Aplica:</strong> quando, para a categoria de inscrição pleiteada, a documentação não é exigida. </li>
      </ul>
      <p><strong>5ª coluna:</strong> “Parecer da documentação”, compreendendo as seguintes possibilidades: </p>
      <ul style="margin-left: 20px;">
        <li><strong>Documentação Aprovada:</strong> quando a documentação foi considerada suficiente para inscrição, nos termos do edital;</li>
        <li><strong>Documentação Reprovada:</strong> quando a documentação foi considerada insuficiente para inscrição, se aplicando para os casos de documentos inadequados ou insuficientes ou documentos não apresentados;</li> 
        <li><strong>Não se Aplica:</strong> quando, para a categoria de inscrição pleiteada, a documentação não é exigida. </li>
      </ul>
      <p><strong>6ª coluna:</strong> “Considerações da análise”, contendo eventuais considerações da Coordenação do Concurso acerca da documentação apresentada;</p>
      <p><strong>7ª coluna:</strong> “Despacho”, compreendendo o DEFERIMENTO ou INDEFERIMENTO da inscrição; </p>
      <p><strong>8ª coluna:</strong> “Motivo do despacho”, compreendendo somente os casos de indeferimento, indicando os termos do Edital que motivam a decisão. Exemplos: “Ausência total da documentação exigida”, quando nenhum dos documentos foram apresentados, ou ”apresentação insuficiente” quando algum dos documentos tem sido apresentado, sem assinatura, ou com indicação de impedimento para participação no concurso”.</p>
      <p>Nos termos do item 12.3.1.4 do Edital, para os IDs que receberam INDEFERIMENTO, será permitida a apresentação de recurso em até 3 dias úteis da data de publicação desta lista, via Plataforma Digital Online, devendo-se apresentar as alegações e documentos que solucionem os apontamentos da motivação do indeferimento. Será obrigatória a apresentação da CARTA DE INTERPOSIÇÃO DE RECURSO, conforme modelo constante do ANEXO V do Edital. Caso o interessado enfrente dificuldades de acesso à Plataforma Digital Online, será permitido o envio da documentação de recurso para o e-mail do concurso (<a class="text-blue-500 underline" href="mailto:concursomoburb.sp2025@spurbanismo.sp.gov.br">concursomoburb.sp2025@spurbanismo.sp.gov.br</a>).</p>
      <p>Pra os casos indeferidos nos termos dos itens 8.3.4.4 e 8.3.4.4.1, quando o participante ou integrante da equipe constou cadastrado em mais de uma inscrição, ou seja, seu nome, CPF ou CNPJ constou em mais de um ID (código identificador da inscrição), será necessária apresentar o recurso somente para a inscrição na qual o participante estiver corretamente cadastrado. Este recurso não dispensa a apresentação da CARTA DE INTERPOSIÇÃO DE RECURSO, conforme modelo constante do ANEXO V do Edital, atendidas as demais disposições do item 12.3.1.4 do Edital.</p>
      <p>Nos termos dos itens 12.3.1.5 e 12.3.1.6, a publicação final da lista de <strong>IDs deferidos</strong> se dará após a análise dos eventuais recursos, conforme o cronograma do Edital (com alterações publicadas em 15/09/2025).</p>
      <p><strong>Os IDs deferidos</strong> serão considerados <strong>inscritos no CONCURSO</strong> e ficarão automaticamente habilitados à Etapa 2 de submissão das <strong>Propostas em Nível de Estudo Preliminar</strong>.</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templateListaFinalInscritos = (): string => {
  return gerarEmailTemplate({
    nome: "Participante",
    titulo: "LISTA FINAL de IDs inscritos no Concurso. Item 12.3.1.5 do Edital",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>Está disponível e nos <a href="https://concursomoburb.prefeitura.sp.gov.br/informes">Informes</a> da <a href="https://concursomoburb.prefeitura.sp.gov.br">Plataforma Digital Online do Concurso</a>, a <strong>LISTA FINAL de IDs deferidos e indeferidos para inscrição no Concurso, nos termos do Item 12.3.1.5 do Edital</strong> nº 001/SP-URB/2025.</p>
      <p>Os Códigos Identificadores (IDs) DEFERIDOS estão INSCRITOS no concurso e habilitados à etapa de submissão das Propostas em Nível de Estudo Preliminar (Fase 1).</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templateEncerramentoAcesso = (): string => {
  return gerarEmailTemplate({
    nome: "Participante",
    titulo: "Concurso do Mobiliário Urbano: Informe aos participantes",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>A Coordenação do Concurso, nos termos das competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025, publicado em 25 de agosto de 2025, agradece aos interessados em participar do certame que tiveram sua pré-inscrição indeferida pelos motivos constantes da <a href="${process.env.NEXT_PUBLIC_APP_URL}/listas/lista01.pdf" download class="text-primary underline">1ª Lista</a>, publicada em 30/09/2025, ou da <a href="${process.env.NEXT_PUBLIC_APP_URL}/listas/lista-recursos.pdf" download class="text-primary underline">Lista de Recursos</a>, publicada em 10/10/2025. Esses interessados terão seu acesso à plataforma encerrado em 3 (três) dias corridos, contados a partir da presente data.</p>
      <p>Aos participantes que tiveram sua inscrição deferida, e que se encontram, portanto, na Fase 1, reiteramos o <a href="${process.env.NEXT_PUBLIC_APP_URL}/informes#projetos" class="text-primary underline">Informe publicado em 11/10/2025</a>, recomendando atenção ao conteúdo do Edital e do Termo de Referência acerca da apresentação das propostas técnicas, bem como à observância da temática do concurso, das diretrizes técnicas e do cronograma — que estabelece como data limite para submissão dos estudos preliminares o dia 27/10/2025.</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templateInformacoesAprovados = (): string => {
  return gerarEmailTemplate({
    nome: "Participante",
    titulo: "Atenção participante inscrito! Você está na Fase 1 do Concurso",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>É com satisfação que informamos que sua inscrição foi deferida, conforme consta da Lista Final de IDs inscritos no Concurso, disponível nos <a href="https://concursomoburb.prefeitura.sp.gov.br/informes">Informes</a> da <a href="https://concursomoburb.prefeitura.sp.gov.br">Plataforma Digital Online do Concurso</a>. Portanto, você está habilitado à etapa de submissão das Propostas em Nível de Estudo Preliminar (Fase 1).</p>
      <p><strong>FIQUE ATENTO!</strong> A submissão das propostas técnicas da Fase 1 deverá ser realizada a partir do dia 13/10/2025 até o dia <strong><span style="color: red;">27/10/2025</span></strong>, conforme consta do Cronograma (com alteração publicada no dia 15/09/2025).</p>
      <p>Na Plataforma Digital Online, os modelos indicados no Termo de Referência (Anexos de 01 a 08), estão disponíveis para download na aba "Modelos", localizada na área restrita do participante <strong>INSCRITO</strong>.</p>
      <p>Antes de submeter a proposta técnica, releia atentamente o Edital e o Termo de Referência. Os arquivos devem ser adequadamente apresentados em formato digital, <strong>em PDF</strong>, seguindo as NORMAS DE APRESENTAÇÃO do Termo de Referência (item 6).</p>
      <p><strong>Atenção!</strong> Antes de submeter a proposta, <strong>certifique-se que nas propriedades (e metadados) do arquivo PDF não constem quaisquer informações de autoria ou que permitam identificá-la.</strong> Seu conteúdo também não pode apresentar marcas identificadoras da autoria. Na página da Adobe, você pode ter mais informações sobre como suprimir informações das propriedades e metadados do PDF. Link: https://helpx.adobe.com/br/acrobat/using/pdf-properties-metadata.html</p>
      <br />
      <p>Desejamos sucesso em sua jornada!</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templateListaAvaliacao = (): string => {
  return gerarEmailTemplate({
    nome: "Participante inscrito(a)",
    titulo: "Concurso do Mobiliário Urbano: LISTA de IDs deferidos e indeferidos para julgamento da FASE 1",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>A Coordenação do Concurso, nos termos das competências atribuídas pelo item 4 do Edital nº 001/SP-URB/2025 publicado em 25 de agosto de 2025 (Edital: 141066448 e publicação: 141068804), registra a conclusão da análise dos arquivos submetidos, relativos às propostas técnicas em nível de estudo preliminar (Fase 1), para verificação quanto à conformidade às NORMAS DE APRESENTAÇÃO E SUBMISSÃO DAS PROPOSTAS, nos termos dos itens 13.1.7, e consequente habilitação para julgamento pela Comissão Julgadora, nos termos dos itens 13.2 e 13.3 do Edital.</p>
      <p>A Lista de IDs deferidos e indeferidos para o julgamento das propostas da FASE 1 apresenta para cada um dos IDs:</p>
      <ul>
        <li>(i) Avaliação da Coordenação do Concurso, relacionada na segunda coluna;</li>
        <li>(ii) Habilitação para julgamento na terceira coluna, indicando “SIM” para as propostas deferidas e “NÃO” para as indeferidas;</li>
        <li>(iii) Motivação do indeferimento, para as propostas indeferidas;</li>
      </ul>
      <p><strong>Nos termos do item 13.3 do Edital, os IDs deferidos serão considerados habilitados para o Julgamento das PROPOSTAS TÉCNICAS em nível de ESTUDO PRELIMINAR – FASE -1.</strong></p>
      <p>A publicação da Lista de IDs deferidos e indeferidos para o julgamento das propostas da FASE 1 foi realizada no Diário Oficial da Cidade de São Paulo e na Plataforma Digital Online do Concurso no dia 03 de novembro de 2025, conforme o cronograma do Edital (item 21, com prorrogação publicada no dia 15 de setembro de 2025).</p>
      <p>O julgamento das propostas da FASE 1 será concluído até o dia 27/11/2025, seguido da 1º publicação da pontuação dos IDs até o dia 01/12/2025 e a lista final até o dia 10/12/2025.</p>
      <p>Nos termos do item 14.4 do Edital, as 3 (três) propostas melhor classificadas passarão à FASE 2 de desenvolvimento dos protótipos e dos projetos em nível básico, recebendo a título de antecipação da premiação final, o valor correspondente a R$ 65.000,00 (sessenta e cinco mil reais), tal como indicado no item 19 do Edital.</p>
      <p>Fique atento pois, caso sua proposta alcance as melhores pontuações, a condição para recebimento da antecipação da premiação e do acesso à FASE 2 consiste na apresentação, dentro do prazo de estabelecido no Cronograma (<strong>até dia 12/12/2025</strong>), <strong>completa dos documentos de habilitação</strong>, conforme item 9 deste Edital, e do <strong>TERMO DE COMPROMISSO DE EXECUÇÃO DOS PROTÓTIPOS PROJETOS EM NÍVEL BÁSICO</strong>, conforme modelo constante do ANEXO VI do Edital.</p>
      <br />
      <p>Fique sempre atento aos Informes.</p>
      <p>Agradecemos a todos pela participação.</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
};

export const templateDuvidasPadraoPlataforma = () => {
  return gerarEmailTemplate({
    nome: "Interessado(a)",
    titulo: "Concurso do Mobiliário Urbano: Pedidos de Esclarecimento",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>Nos termos do item 7.2 do Edital nº 001/SP-URB/2025, os Pedidos de Esclarecimento são analisados e as respostas são publicadas no Diário Oficial da Cidade de São Paulo e disponibilizadas na Plataforma Digital Online do Concurso em “Informes”.</p>
      <p>O 1º Bloco de Respostas foi publicado em 08/09/2025 e o 2º Bloco de Respostas foi publicado em 11/09/2025. Caso tenha enviado um pedido de esclarecimento recentemente, fique atento, pois os esclarecimentos logo serão publicados.</p>
      <p>Nos termos do item 7.2 do Edital, cabe aos participantes acessar a Plataforma Digital Online e acompanhar as publicações no Diário Oficial da Cidade de São Paulo para obtenção das informações prestadas.</p>
      <br />
      <p>Desejamos sucesso em sua jornada!</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
}

export const templateDuvidasPadraoEmail = () => {
  return gerarEmailTemplate({
    nome: "Interessado(a)",
    titulo: "Concurso do Mobiliário Urbano: Pedidos de Esclarecimento",
    subtitulo: "Informação importante sobre o concurso",
    conteudoPrincipal: `
      <p>Nos termos do item 7.2 do Edital nº 001/SP-URB/2025, os Pedidos de Esclarecimento são analisados e as respostas são publicadas no Diário Oficial da Cidade de São Paulo e disponibilizadas na Plataforma Digital Online do Concurso em “Informes”.</p>
      <p>O 1º Bloco de Respostas foi publicado em 08/09/2025 e o 2º Bloco de Respostas foi publicado em 11/09/2025. Caso tenha enviado um pedido de esclarecimento recentemente, fique atento, pois os esclarecimentos logo serão publicados.</p>
      <p>Nos termos do item 7.2 do Edital, cabe aos participantes acessar a Plataforma Digital Online e acompanhar as publicações no Diário Oficial da Cidade de São Paulo para obtenção das informações prestadas.</p>
      <br />
      <p>Desejamos sucesso em sua jornada!</p>
      <br />
      <p>Atenciosamente,</p>
      <p>Coordenação do Concurso.</p>
    `,
    botaoTexto: 'Ver Detalhes',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}`
  });
}

// Template de notificação geral
export const templateNovo = (nome: string, titulo: string, mensagem: string): string => {
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
export const templateBoasVindasParticipante = (nome: string, protocolo: string, senha: string): string => {
  return gerarEmailTemplate({
    nome,
    titulo: 'Seja bem-vindo ao Concurso Nacional de Projetos de Mobiliário Urbano da Prefeitura de São Paulo!',
    subtitulo: 'Você está na etapa de pré-inscrição (item 12.3.1 do Edital nº 001/SP-URB/2025).',
    conteudoPrincipal: `
      <p>Este é seu Código Identificador (ID): <strong>${protocolo}</strong></p>
      <p>Guarde bem o seu ID, é com ele que você verificará o andamento de sua inscrição e a avaliação da sua proposta técnica.</p>
      <p>Nos termos do item 12.3.1.1.1 do Edital nº 001/SP-URB/2025, o código de identificador (ID) deverá ser mantido sob sigilo, sendo irrevogável e intransferível, não cabendo a SP URBANISMO ou a COORDENAÇÃO DO CONCURSO, a emissão de novo ID em caso de perda.</p>
      <p>Você está recebendo uma senha provisória de acesso à Plataforma. Faça o login com seu e-mail e senha provisória, depois insira sua senha de preferência. </a>
      <p>Sua senha provisória é: <strong>${senha}</strong></p>
      <p>Entre os dias 08/09/2025 e 15/09/2025 você deverá submeter os documentos necessários para inscrição, conforme item 9.2 do Edital nº 001/SP-URB/2025:</p>
      <ul>
        <li>Carta de Declarações Obrigatórias de pessoa física ou pessoa jurídica assinada, conforme item 10 do Edital e ANEXO I ou ANEXO II.</li>
        <li>Declaração de Participação na Equipe, em caso de inscrição em equipe, assinada pelos membros que a constituem, conforme ANEXO III.</li>
        <li>Prova de regularidade fiscal para com a Fazenda Nacional e relativa à Seguridade Social (INSS), que será efetuada mediante apresentação de certidão expedida conjuntamente pela Secretaria da Receita Federal do Brasil (RFB) e pela Procuradoria-Geral da Fazenda Nacional (PGFN), referente a todos os créditos tributários federais e à Dívida Ativa da União (DAU) por elas administrados;</li>
        <li>Prova de regularidade fiscal para com a Fazenda Municipal do domicílio ou sede da interessada expedida pelo órgão competente;</li>
        <li>Cadastro Informativo Municipal de São Paulo - CADIN.</li>
        <li>Comprovação de Registro ou Certidão de inscrição da pessoa física ou pessoa jurídica no Conselho de Arquitetura e Urbanismo - CAU ou no Conselho de Engenharia e Agronomia - CREA da região da sede da empresa.</li>
      </ul>
      <p>No caso de Pessoa Jurídica, o RESPONSÁVEL TÉCNICO pelo projeto deverá estar vinculado à Pessoa Jurídica como integrante do quadro social, como empregado ou como contratado.</p>
      <p>De acordo com o item 12.3.1.2.1 do Edital, todos os documentos devem ser submetidos em formato PDF, não podendo ultrapassar 20Mb (vinte megabites) no total, e devem ser nomeados, conforme as NORMAS DE APRESENTAÇÃO DE DOCUMENTOS DE HABILITAÇÃO - Anexo IV do Edital.</p>
      <p>Depois de submeter a documentação, fique atento ao CRONOGRAMA e aos informes na PLATAFORMA DO CONCURSO, pois divulgaremos a lista dos IDs deferidos e indeferidos, nos termos do item 12.3.1.3 do Edital.</p>
      <p>Caso seu ID constar como DEFERIDO, você será considerado INSCRITO no concurso e estará apto para submeter sua proposta técnica em nível de Estudo Preliminar.</p>
      <p>Caso conste como INDEFERIDO, você poderá apresentar um recurso em até 3 dias após a publicação da lista. Neste caso, siga as orientações do item 12.3.1.4 do Edital.</p>
      <p>A publicação final dos IDs deferidos e indeferidos será no dia 03/10/2025.</p>
      <p>Observação: nos termos do item 21.2 do Edital, eventuais alterações no cronograma podem acontecer. Caso ocorram serão notificadas na Plataforma Online do Concurso e no Diário Oficial. Fique atento!</p>
      <a href="${process.env.BASE_URL}">Acesse aqui a plataforma e submeta sua documentação.</a>
      <p>Desejamos sucesso em sua jornada!</p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        icone: '#️⃣',
        titulo: 'Código identificador (ID)',
        descricao: 'Guarde bem o seu ID, é com ele que você verificará o andamento de sua inscrição e a avaliação da sua proposta técnica.'
      },
      {
        icone: '🔑',
        titulo: 'Senha provisória',
        descricao: `Sua senha de acesso inicial é: ${senha}`
      }
    ]
  });
};

export const templateBoasVindasCoordenacao = (protocolo: string): string => {
  return gerarEmailTemplate({
    tipo: "coordenacao",
    nome: 'Equipe Administrativa',
    titulo: `Foi processada uma pré-inscrição no concurso sob o Código Identificador: <strong>${protocolo}</strong>`,
    subtitulo: 'Acesse o painel administrativo para conferir os dados da inscrição.',
    conteudoPrincipal: `
      <p>O interessado terá, até o dia 15/09/2025, que apresentar via Plataforma Digital Online, a seguinte documentação (item 9.2 do Edital nº 001/SP-URB/2025):</p>
      <ul>
        <li>Carta de Declarações Obrigatórias de pessoa física ou pessoa jurídica assinada, conforme item 10 do Edital e ANEXO I ou ANEXO II.</li>
        <li>Declaração de Participação na Equipe, em caso de inscrição em equipe, assinada pelos membros que a constituem, conforme ANEXO III.</li>
        <li>Prova de regularidade fiscal para com a Fazenda Nacional e relativa à Seguridade Social (INSS), que será efetuada mediante apresentação de certidão expedida conjuntamente pela Secretaria da Receita Federal do Brasil (RFB) e pela Procuradoria-Geral da Fazenda Nacional (PGFN), referente a todos os créditos tributários federais e à Dívida Ativa da União (DAU) por elas administrados;</li>
        <li>Prova de regularidade fiscal para com a Fazenda Municipal do domicílio ou sede da interessada expedida pelo órgão competente;</li>
        <li>Cadastro Informativo Municipal de São Paulo - CADIN.</li>
        <li>Comprovação de Registro ou Certidão de inscrição da pessoa física ou pessoa jurídica no Conselho de Arquitetura e Urbanismo - CAU ou no Conselho de Engenharia e Agronomia - CREA da região da sede da empresa.</li>
      </ul>
      <p>No caso de Pessoa Jurídica, o RESPONSÁVEL TÉCNICO pelo projeto deverá estar vinculado à Pessoa Jurídica como integrante do quadro social, como empregado ou como contratado.</p>
      <p>De acordo com o item 12.3.1.2.1 do Edital, todos os documentos devem ser submetidos em formato PDF, não podendo ultrapassar 20Mb (vinte megabites) no total, e devem ser nomeados, conforme as NORMAS DE APRESENTAÇÃO DE DOCUMENTOS DE HABILITAÇÃO - Anexo IV do Edital.</p>
      <p>A Coordenação do Concurso deverá proceder com a análise da documentação apresentada. Fiquen atentos ao CRONOGRAMA, pois deverá ser informada na PLATAFORMA DO CONCURSO a lista dos IDs deferidos e indeferidos, nos termos do item 12.3.1.3 do Edital.</p>
      <p>Em caso de DEFERIMENTO, o interessado será considerado INSCRITO no concurso e estará apto para submeter sua proposta técnica em nível de Estudo Preliminar, sendo agora considerado como PARTICIPANTE INSCRITO.</p>
      <p>Em caso de INDEFERIMENTO, o interessado poderá apresentar um recurso em até 3 dias após a publicação da lista. Neste caso, ele deverá observar o item 12.3.1.4 do Edital. Fiquem atentos aos pedidos de RECURSO, pois estes deverão ser analisados no período estabelecido no Cronograma (item 21 do edital) e deverão resultar em uma publicação final de IDs deferidos e indeferidos.</p>
      <p><strong>A publicação final dos IDs deferidos e indeferidos será no dia 03/10/2025.</strong></p>
      <p>Observação: nos termos do item 21.2 do Edital, eventuais alterações no cronograma podem acontecer. Caso ocorram serão notificadas na Plataforma Online do Concurso e no Diário Oficial. Fique atento!</p>
      <p>Obrigado.</p>
      <p>Atenciosamente,</p>
      <p>Plataforma Digital Online do Concurso do Mobiliário Urbano.</p>
    `,
    botaoTexto: 'Acessar Painel Administrativo',
    botaoUrl: `${process.env.BASE_URL}/cadastros`
  });
};

export const templateNovaDuvidaParticipante = (nome: string): string => {
  return gerarEmailTemplate({
    nome,
    titulo: 'PEDIDO DE ESCLARECIMENTO PROCESSADO',
    subtitulo: 'Seu pedido de esclarecimento foi processado e será analisado pela Coordenação do Concurso nos termos do item 7.2 do Edital nº 001/SP-URB/2025.',
    conteudoPrincipal: `
      <p>Fique atento aos anúncios no Diário Oficial da Cidade de São Paulo e informes na Plataforma Digital Online do concurso para verificar as respostas, que poderão ser agrupadas em lotes ou por temas, nos termos do item 7.2.2 do Edital.</p>
      <p>Agradecemos seu interesse.</p>
      <p>Atenciosamente,</p>
      <p>Plataforma Digital Online do Concurso do Mobiliário Urbano.</p>
    `,
  });
};

// Template de notificação de nova dúvida
export const templateNovaDuvidaCoordenacao = (nome: string, email: string, pergunta: string): string => {
  return gerarEmailTemplate({
    tipo: "coordenacao",
    nome: 'Equipe Administrativa',
    titulo: `Foi processado um pedido de esclarecimento de ${nome}, cadastrado com o e-mail ${email}:`,
    subtitulo: 'Acesse o painel administrativo para responder esta dúvida.',
    conteudoPrincipal: `
      <p><strong>${pergunta}</strong></p>
      <p>Você também pode acessar o pedido de esclarecimento via Plataforma Digital Online. É preciso agora analisar o pedido e certificar-se que ele será considerado na resposta da Coordenação do Concurso que poderá ser agrupada a outras respostas em lotes ou por temas, visando a melhor compreensão dos participantes, nos termos do item 7.2.3 do Edital.</p>
      <p>Os prazos de resposta devem observar o cronograma do concurso, conforme item 21 do Edital.</p>
      <p>Obrigado.</p>
      <p>Atenciosamente,</p>
      <p>Plataforma Digital Online do Concurso do Mobiliário Urbano.</p>
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
      }
    ],
    botaoTexto: 'Responder Dúvida',
    botaoUrl: `${process.env.BASE_URL}/duvidas`
  });
};

// Template de recuperação de senha
export const templateRecuperacaoSenha = (nome: string, novaSenha: string): string => {
  return gerarEmailTemplate({
    nome,
    titulo: 'Recuperação de Senha',
    subtitulo: 'Sua nova senha temporária foi gerada',
    conteudoPrincipal: `
      <p>Olá <strong>${nome}</strong>,</p>
      <p>Recebemos uma solicitação de recuperação de senha para sua conta no <strong>Concurso Mobiliário Urbano</strong>.</p>
      <p>Sua nova senha temporária é: <strong style="font-size: 18px; color: ${styles.corDestaque}; background-color: #f3f4f6; padding: 8px 12px; border-radius: 4px; letter-spacing: 2px;">${novaSenha}</strong></p>
      <p><strong>Importante:</strong></p>
      <ul>
        <li>Esta é uma senha temporária e você será obrigado a alterá-la no próximo login</li>
        <li>Guarde esta senha em local seguro</li>
        <li>Após fazer login, você será redirecionado para a tela de alteração de senha</li>
      </ul>
      <p>Se você não solicitou esta recuperação de senha, ignore este email e sua senha atual permanecerá inalterada.</p>
      <p>Para sua segurança, recomendamos que você altere sua senha assim que fizer login no sistema.</p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        icone: '🔑',
        titulo: 'Senha Temporária',
        descricao: `Use esta senha para acessar o sistema: ${novaSenha}`
      },
      {
        icone: '⚠️',
        titulo: 'Alteração Obrigatória',
        descricao: 'Você será obrigado a alterar esta senha no próximo login por questões de segurança.'
      },
      {
        icone: '🔒',
        titulo: 'Segurança',
        descricao: 'Não compartilhe esta senha com ninguém e altere-a assim que fizer login.'
      }
    ],
    botaoTexto: 'Acessar Sistema',
    botaoUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`
  });
};
