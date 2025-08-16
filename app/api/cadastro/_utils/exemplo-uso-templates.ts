/**
 * Exemplos práticos de uso dos templates de email
 * Este arquivo demonstra como utilizar os diferentes templates disponíveis
 */

import {
  gerarEmailTemplate,
  templateConfirmacaoInscricao,
  templateNotificacao,
  templateLembrete,
  templateBoasVindas
} from './email-templates';

// Exemplo 1: Template de confirmação de inscrição (já integrado)
export const exemploConfirmacaoInscricao = () => {
  const nome = 'João Silva';
  return templateConfirmacaoInscricao(nome);
};

// Exemplo 2: Notificação sobre resultado de fase
export const exemploResultadoFase = () => {
  const nome = 'Maria Santos';
  const titulo = 'Resultado da Primeira Fase Divulgado';
  const mensagem = `
    <p>Informamos que o resultado da <strong>primeira fase</strong> do Concurso Mobiliário Urbano foi divulgado.</p>
    <p>Você pode acessar sua área restrita em nosso portal para verificar sua situação atual e as próximas etapas.</p>
    <p>Parabéns por participar e boa sorte nas próximas fases!</p>
  `;
  
  return templateNotificacao(nome, titulo, mensagem);
};

// Exemplo 3: Lembrete de prazo importante
export const exemploLembretePrazo = () => {
  const nome = 'Carlos Oliveira';
  const evento = 'Entrega Final dos Projetos';
  const data = '15 de abril de 2024 às 23h59';
  
  return templateLembrete(nome, evento, data);
};

// Exemplo 4: Boas-vindas para novos participantes
export const exemploBoasVindas = () => {
  const nome = 'Ana Costa';
  return templateBoasVindas(nome);
};

// Exemplo 5: Template customizado para avaliação
export const exemploAvaliacaoCustomizada = () => {
  return gerarEmailTemplate({
    nome: 'Pedro Santos',
    titulo: 'Sua Proposta Está em Avaliação',
    subtitulo: 'Acompanhe o processo de análise do seu projeto',
    conteudoPrincipal: `
      <p>Sua proposta para o <strong>Concurso Mobiliário Urbano</strong> foi recebida e está atualmente em processo de avaliação pela nossa comissão técnica.</p>
      <p>O processo de avaliação seguirá os seguintes critérios:</p>
      <ul style="margin: 16px 0; padding-left: 20px; color: #6b7280;">
        <li>Inovação e criatividade</li>
        <li>Viabilidade técnica</li>
        <li>Sustentabilidade</li>
        <li>Adequação ao espaço urbano</li>
      </ul>
      <p>Em breve você receberá o resultado da avaliação. Agradecemos sua participação!</p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        titulo: 'Cronograma',
        descricao: 'Acompanhe todas as datas importantes do concurso em nosso portal.'
      },
      {
        titulo: 'Regulamento',
        descricao: 'Consulte sempre o regulamento oficial para esclarecer dúvidas.'
      },
      {
        titulo: 'Suporte',
        descricao: 'Nossa equipe está disponível para ajudar com questões técnicas.'
      }
    ],
    botaoTexto: 'Acompanhar Status',
    botaoUrl: 'https://concurso.prefeitura.sp.gov.br/meu-projeto'
  });
};

// Exemplo 6: Notificação de documentos pendentes
export const exemploDocumentosPendentes = () => {
  return gerarEmailTemplate({
    nome: 'Lucia Fernandes',
    titulo: 'Documentos Pendentes',
    subtitulo: 'Ação necessária para completar sua inscrição',
    conteudoPrincipal: `
      <p>Identificamos que alguns <strong>documentos obrigatórios</strong> ainda não foram enviados em sua inscrição.</p>
      <p>Para que sua participação seja válida, é necessário o envio dos seguintes itens:</p>
      <ul style="margin: 16px 0; padding-left: 20px; color: #6b7280;">
        <li>Comprovante de formação acadêmica</li>
        <li>Declaração de autoria do projeto</li>
        <li>Memorial descritivo (formato PDF)</li>
      </ul>
      <p><strong>Prazo limite:</strong> 20 de março de 2024</p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        titulo: 'Upload Rápido',
        descricao: 'Use nossa ferramenta de upload para enviar múltiplos arquivos de uma vez.'
      },
      {
        titulo: 'Formatos Aceitos',
        descricao: 'PDF, JPG, PNG com tamanho máximo de 10MB por arquivo.'
      }
    ],
    botaoTexto: 'Enviar Documentos',
    botaoUrl: 'https://concurso.prefeitura.sp.gov.br/documentos'
  });
};

// Exemplo 7: Convite para evento presencial
export const exemploConviteEvento = () => {
  return gerarEmailTemplate({
    nome: 'Roberto Almeida',
    titulo: 'Você está convidado!',
    subtitulo: 'Apresentação pública dos projetos finalistas',
    conteudoPrincipal: `
      <p>É com grande satisfação que convidamos você para a <strong>apresentação pública dos projetos finalistas</strong> do Concurso Mobiliário Urbano.</p>
      <p><strong>Data:</strong> 30 de maio de 2024<br>
      <strong>Horário:</strong> 14h às 18h<br>
      <strong>Local:</strong> Centro Cultural São Paulo - Sala Multiuso</p>
      <p>Este será um momento especial para conhecer todos os projetos selecionados e interagir com outros participantes e a comissão avaliadora.</p>
      <p><em>A presença não é obrigatória, mas será uma excelente oportunidade de networking!</em></p>
    `,
    mostrarCards: true,
    cardsPersonalizados: [
      {
        titulo: 'Programação',
        descricao: '14h-15h: Apresentações | 15h-16h: Coffee break | 16h-18h: Debates'
      },
      {
        titulo: 'Como Chegar',
        descricao: 'Estação Vergueiro do Metrô - Saída Rua Vergueiro, 1000'
      }
    ],
    botaoTexto: 'Confirmar Presença',
    botaoUrl: 'https://concurso.prefeitura.sp.gov.br/evento/confirmar'
  });
};

// Função utilitária para testing durante desenvolvimento
export const visualizarTemplate = (templateFunction: () => string, nomeArquivo: string) => {
  if (process.env.NODE_ENV === 'development') {
    const html = templateFunction();
    // Em desenvolvimento, você pode salvar em arquivo para visualizar
    console.log(`Template ${nomeArquivo} gerado com sucesso!`);
    return html;
  }
  return templateFunction();
};
