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
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%); border-radius: 12px; text-align: center; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  <div style="width: 28px; height: 28px; background: #ffffff; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                    <span style="color: ${cardColor}; font-size: 16px; font-weight: bold; line-height: 1;">${card.icone || '📋'}</span>
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
                    <img src="${baseUrl}/promocao/prefeitura.png" 
                         alt="Prefeitura de São Paulo" 
                         style="max-width: 200px; height: auto; max-height: 80px; display: block;" />
                  </div>
                  
                  <!-- Logo do SPUrbanismo -->
                  <div style="display: inline-block; text-align: center; vertical-align: top;">
                    <img src="${baseUrl}/promocao/spurbanismo.png" 
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
