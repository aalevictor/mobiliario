/** @format */

import { Arquivo, Cadastro, NivelLog, Participante, Permissao, Prisma, TipoArquivo, Tipo_Usuario, Avaliacao_Licitadora } from "@prisma/client";
import { db } from "@/lib/prisma";
import { PreCadastro } from "@/app/api/cadastro/pre-cadastro.dto";
import { hashPassword } from "@/lib/password";
import { gerarSenha, verificaLimite, verificaPagina } from "@/lib/utils";
import { IAvaliacaoLicitadora } from "@/app/api/cadastro/[id]/avaliacao-licitadora/route";
import { getCurrentUserForEmail } from "@/lib/email-logger";
import { templateBoasVindasCoordenacao, templateBoasVindasParticipante } from "@/app/api/cadastro/_utils/email-templates";
import { AuditLogger } from "@/lib/audit-logger";
import { auth } from "@/auth";

function geraProtocolo(id: number) {
  const mascara = 17529 * id ** 2 + 85474;
  const chave1 = 7458321;
  const chave2 = 13874219;
  const protocolo = ((mascara + chave1) ^ chave2).toString();
  return `MOB-2025-${protocolo.padStart(10, "0")}`;
}

async function criarPreCadastro(
  preCadastro: PreCadastro
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const preCadastroSaved = await db.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const { participantes, ...data } = preCadastro;
      const senha = gerarSenha();
      const senhaHashed = hashPassword(senha);
      const novo_usuario = await tx.usuario.create({
        data: {
          nome: data.nome,
          email: data.email,
          senha: senhaHashed,
          tipo: Tipo_Usuario.EXTERNO,
          permissao: Permissao.PARTICIPANTE,
          alterarSenha: true,
        },
      });
      const { cnpj, ...data_cadastro } = { ...data };
      const novo_cadastro = await tx.cadastro.create({
        data: { 
          ...data_cadastro, 
          usuarioId: novo_usuario.id,
          cnpj: (cnpj && cnpj.trim() !== "") ? cnpj : null
        }
      });
      try {
        if (participantes && participantes.length > 0)
          await tx.participante.createMany({
            data: participantes.map((participante) => ({
              ...participante,
              cadastroId: novo_cadastro.id,
            })),
          })
        const protocolo = geraProtocolo(novo_cadastro.id);
        const cadastro_protocolo = await tx.cadastro.update({
          where: { id: novo_cadastro.id },
          data: { protocolo }
        });
        if (cadastro_protocolo) {
          const usuario = getCurrentUserForEmail();
          const response = await fetch(`${process.env.MAIL_API}/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: process.env.MAIL_FROM || '',
              to: data.email,
              subject: 'PRÉ-INSCRIÇÃO REGISTRADA',
              html: templateBoasVindasParticipante(data.nome, protocolo, senha),
            }),
          });
          if (response.ok) {
            await AuditLogger.logApiRequest(
              `🔒 EMAIL ENVIADO: ${process.env.MAIL_FROM} para ${data.email}`,
              NivelLog.INFO,
              'email/info',
              'POST',
              usuario
            );
          } else {
            const error = new Error('Email não enviado');
            await AuditLogger.logError(
              `🚨 EMAIL CRÍTICO FALHOU: ${process.env.MAIL_FROM} para ${data.email}`,
              error instanceof Error ? error.stack : undefined,
              NivelLog.CRITICAL,
              'email/critical',
              'POST',
              usuario
            );
          }

          // Email para coordenação (opcional)
          if (process.env.MAIL_BCC) {
              const response = await fetch(`${process.env.MAIL_API}/send-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: process.env.MAIL_FROM || '',
                  to: process.env.MAIL_BCC,
                  subject: 'PRÉ-INSCRIÇÃO REGISTRADA',
                  html: templateBoasVindasCoordenacao(protocolo),
                }),
              });
              if (response.ok) {
                await AuditLogger.logApiRequest(
                  `🔒 EMAIL ENVIADO: ${process.env.MAIL_FROM} para ${process.env.MAIL_BCC}`,
                  NivelLog.INFO,
                  'email/info',
                  'POST',
                  usuario
                );
              } else {
                const error = new Error('Email não enviado');
                await AuditLogger.logError(
                  `🚨 EMAIL CRÍTICO FALHOU: ${process.env.MAIL_FROM} para ${process.env.MAIL_BCC}`,
                  error instanceof Error ? error.stack : undefined,
                  NivelLog.CRITICAL,
                  'email/critical',
                  'POST',
                  usuario
                );
              }
          }
        }
        return cadastro_protocolo;
      } catch (error) {
        tx.cadastro.delete({ where: { id: novo_cadastro.id } });
        tx.usuario.delete({ where: { id: novo_usuario.id } });
        return error;
      }
    },
    {
      maxWait: 20000,
      timeout: 60000,
    }
  );

  return preCadastroSaved;
}

async function emailsParticipantes() {
  const emailsParticipantes = await db.cadastro.findMany({
    select: { email: true }
  });
  const emails = [];
  for (const item of emailsParticipantes) emails.push(item.email);
  return emails;
}

async function emailsAprovados() {
  const emailsAprovados = await db.cadastro.findMany({
    select: { email: true },
    where: { avaliacao_licitadora: { aprovado: true } }
  });
  const emails = [];
  for (const item of emailsAprovados) emails.push(item.email);
  return emails;
}

async function meuCadastro(id: string) {
  const cadastro = await db.cadastro.findUnique({ 
    where: { usuarioId: id },
    include: { 
      participantes: true,
      arquivos: true,
      avaliacao_licitadora: true,
      avaliacoes_julgadora: true,
    }
  });
  return cadastro;
}

async function buscarCadastros(
  permissao: Permissao,
  pagina: number = 1,
  limite: number = 10,
  busca?: string,
  documentosEnviados?: string,
  projetosEnviados?: string,
  tipoInscricao?: string,
  avaliacao?: string
) {
  [pagina, limite] = verificaPagina(pagina, limite);
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('Usuário não autenticado');
  }
  const select = ["ADMIN", "DEV"].includes(permissao) ? {
    id: true,
    protocolo: true,
    email: true,
    nome: true,
    cnpj: true,
    cpf: true,
    carteira_tipo: true,
    carteira_numero: true,
    logradouro: true,
    numero: true,
    complemento: true,
    cep: true,
    cidade: true,
    uf: true,
    criadoEm: true,
    avaliacao_licitadora: {
      select: {
        id: true,
        parecer: true,
        aprovado: true,
        observacoes: true,
        liberadoAval: true,
      }
    },
    avaliacoes_julgadora: {
      select: {
        id: true,
        linhaTematica1: true,
        linhaTematica2: true,
        linhaTematica3: true,
        conceitoProjetual: true,
        atendimentoNormas: true,
        insercaoUrbana: true,
        qualidadeFuncional: true,
        exequibilidade: true,
        economicidade: true,
        qualidadeGrafica: true,
        observacoes: true,
      }
    },
    participantes: {
      select: {
        id: true,
        nome: true,
        documento: true,
      }
    },
    arquivos: {
      select: {
        id: true,
        caminho: true,
        tipo: true
      }
    }
  }: ["JULGADORA"].includes(permissao)	?  {
    id: true,
    protocolo: true,
    arquivos: {
      where: {
        tipo: TipoArquivo.PROJETOS,
      },
      select: {
        id: true,
        caminho: true,
        tipo: true,
        criadoEm: true,
      },
    },
    avaliacoes_julgadora: {
      select: {
        id: true,
        linhaTematica1: true,
        linhaTematica2: true,
        linhaTematica3: true,
        conceitoProjetual: true,
        atendimentoNormas: true,
        insercaoUrbana: true,
        qualidadeFuncional: true,
        exequibilidade: true,
        economicidade: true,
        qualidadeGrafica: true,
        observacoes: true,
        desclassificado: true,
        mencao_honrosa: true,
        avaliado: true,
        criadoEm: true,
        atualizadoEm: true,
      },
      where: {
        avaliadorId: session.user.id,
      }
    }
  }: { id: true };
  interface some {
    tipo?: any;
  }

  interface none {
    tipo?: any
  }
  interface arquivos {
    none?: none,
    some?: some
  }

  let arquivos: arquivos = {};
  let AND: any[] = [];

  if (documentosEnviados === "true" || projetosEnviados === "true") {
    if (documentosEnviados === "true" && projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" || projetosEnviados === "false") {
    if (documentosEnviados === "false" && projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "true" && projetosEnviados === "false") {
    arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" && projetosEnviados === "true") {
    arquivos.some = { tipo: TipoArquivo.PROJETOS }
    arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
  }

  if (arquivos.some) AND.push({ arquivos: { some: arquivos.some }});
  if (arquivos.none) AND.push({ arquivos: { none: arquivos.none }});
  
  const where: any = {
    ...(busca && {
        OR: [
            { nome: { contains: busca } },
            { email: { contains: busca } },
            { cnpj: { contains: busca } },
            { cpf: { contains: busca } },
        ],
    }),
    ...(AND.length > 0 && { AND }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: null } }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: "" } }),
    ...(tipoInscricao === "PF" && { 
      OR: [
        { cnpj: null },
        { cnpj: "" }
      ]
    }),
    ...(permissao === "JULGADORA" && { avaliacao_licitadora: { aprovado: true, liberadoAval: true }}),
    ...(avaliacao === "AGUARDANDO" && { avaliacao_licitadora: null }),
    ...(avaliacao === "DEFERIDO" && { avaliacao_licitadora: { liberadoAval: true } }),
    ...(avaliacao === "INDEFERIDO" && { avaliacao_licitadora: { liberadoAval: false } }),
  }
  const total = await db.cadastro.count({ where });
  if (total == 0) return { total: 0, pagina: 0, limite: 0, data: [] };
  [pagina, limite] = verificaLimite(pagina, limite, total);
  let cadastros = await db.cadastro.findMany({
    where,
    select,
    orderBy: { criadoEm: 'asc' },
    skip: (pagina - 1) * limite,
    take: limite,
  });
  return {
    total: +total,
    pagina: +pagina,
    limite: +limite,
    data: cadastros,
  };
}

async function criarAvaliacaoLicitadora(id: number, avaliadorId: string, data: IAvaliacaoLicitadora) {
  const avaliacao_licitadora = await db.avaliacao_Licitadora.create({
    data: {
      ...data,
      cadastroId: id,
      avaliadorId,
    },
  });
  return avaliacao_licitadora;
}

async function atualizarAvaliacaoLicitadora(id: string, avaliadorId: string, data: IAvaliacaoLicitadora) {
  const avaliacao_licitadora = await db.avaliacao_Licitadora.update({
    where: { id },
    data: { ...data, avaliadorId },
  });
  return avaliacao_licitadora;
}

async function buscarCadastrosExportacao({ busca, documentosEnviados, projetosEnviados, tipoInscricao }: { busca?: string, documentosEnviados?: string, projetosEnviados?: string, tipoInscricao?: string }): Promise<{ headers: string[], rows: (string | null)[][] }> {
  interface some {
    tipo?: any;
  }

  interface none {
    tipo?: any
  }
  interface arquivos {
    none?: none,
    some?: some
  }
  let arquivos: arquivos = {};
  let AND: any[] = [];

  if (documentosEnviados === "true" || projetosEnviados === "true") {
    if (documentosEnviados === "true" && projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" || projetosEnviados === "false") {
    if (documentosEnviados === "false" && projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "true" && projetosEnviados === "false") {
    arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" && projetosEnviados === "true") {
    arquivos.some = { tipo: TipoArquivo.PROJETOS }
    arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
  }

  if (arquivos.some) AND.push({ arquivos: { some: arquivos.some }});
  if (arquivos.none) AND.push({ arquivos: { none: arquivos.none }});

  const where: any = {
    ...(busca && {
        OR: [
            { nome: { contains: busca } },
            { email: { contains: busca } },
            { cnpj: { contains: busca } },
            { cpf: { contains: busca } },
        ],
    }),
    ...(AND.length > 0 && { AND }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: null } }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: "" } }),
    ...(tipoInscricao === "PF" && { 
      OR: [
        { cnpj: null },
        { cnpj: "" }
      ]
    }),
  }
  const cadastros = await db.cadastro.findMany({
    orderBy: { criadoEm: 'asc' },
    where,
    select: {
      id: true,
      criadoEm: true,
      protocolo: true,
      nome: true,
      email: true,
      carteira_tipo: true,
      carteira_numero: true,
      cep: true,
      cidade: true,
      uf: true,
      avaliacao_licitadora: {
        select: {
          aprovado: true,
          liberadoAval: true,
        }
      },
      arquivos: {
        select: {
          caminho: true,
          tipo: true,
        }
      },
      participantes: {
        select: {
          nome: true,
          documento: true,
        }
      }
    }
  });

  const headers = [
    "Data",
    "Situação",
    "ID sequencial",
    "ID",
    "Nome",
    "E-mail",
    "CAU/CREA",
    "Equipe",
    "Número de Membros",
    "Membros",
    "Documentos enviados",
    "Projetos enviados",
    "Documentos de Recurso enviados",
    "CEP",
    "Cidade",
    "UF",
  ];
  
  const rows = cadastros.map((cadastro) => {
    const participantes = cadastro.participantes || [];
    const arquivos = cadastro.arquivos || [];
    const arquivosEnviados = arquivos.filter((arquivo) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && !arquivo.caminho.split("/").pop()?.startsWith("RECURSO-")).length || 0;
    const projetosEnviados = arquivos.filter((arquivo) => arquivo.tipo === TipoArquivo.PROJETOS).length || 0;
    const recursosEnviados = arquivos.filter((arquivo) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho.split("/").pop()?.startsWith("RECURSO-")).length || 0;
    const analisado = !!cadastro.avaliacao_licitadora
    const situacao = analisado ? cadastro.avaliacao_licitadora?.liberadoAval ? "Deferido" : "Indeferido" : "Aguardando análise"
    return [
      `${cadastro.criadoEm}`,
      `${situacao}`,
      `${cadastro.id}`,
      cadastro.protocolo,
      cadastro.nome,
      cadastro.email,
      `${cadastro.carteira_tipo} - ${cadastro.carteira_numero}`,
      participantes.length > 0 ? "Sim" : "Não",
      `${participantes.length}`,
      participantes.map((participante) => `${participante.nome} - ${participante.documento}`).join("\n"),
      `${arquivosEnviados}`,
      `${projetosEnviados}`,
      `${recursosEnviados}`,
      cadastro.cep,
      cadastro.cidade,
      cadastro.uf,
    ];
  });

  return { headers, rows };
}

async function buscarParticipantesExportacao({ busca, documentosEnviados, projetosEnviados, tipoInscricao, avaliacao }: { busca?: string, documentosEnviados?: string, projetosEnviados?: string, tipoInscricao?: string, avaliacao?: string }): Promise<{ headers: string[], rows: (string | null | undefined)[][] }> {
  interface some {
    tipo?: any;
  }

  interface none {
    tipo?: any
  }
  interface arquivos {
    none?: none,
    some?: some
  }
  let arquivos: arquivos = {};
  let AND: any[] = [];

  if (documentosEnviados === "true" || projetosEnviados === "true") {
    if (documentosEnviados === "true" && projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" || projetosEnviados === "false") {
    if (documentosEnviados === "false" && projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "true" && projetosEnviados === "false") {
    arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" && projetosEnviados === "true") {
    arquivos.some = { tipo: TipoArquivo.PROJETOS }
    arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
  }

  if (arquivos.some) AND.push({ arquivos: { some: arquivos.some }});
  if (arquivos.none) AND.push({ arquivos: { none: arquivos.none }});

  const where: any = {
    ...(busca && {
        OR: [
            { nome: { contains: busca } },
            { email: { contains: busca } },
            { cnpj: { contains: busca } },
            { cpf: { contains: busca } },
        ],
    }),
    ...(AND.length > 0 && { AND }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: null } }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: "" } }),
    ...(tipoInscricao === "PF" && { 
      OR: [
        { cnpj: null },
        { cnpj: "" }
      ]
    }),
    ...(avaliacao === "AGUARDANDO" && { avaliacao_licitadora: null }),
    ...(avaliacao === "DEFERIDO" && { avaliacao_licitadora: { liberadoAval: true } }),
    ...(avaliacao === "INDEFERIDO" && { avaliacao_licitadora: { liberadoAval: false } }),
  }

  const cadastros = await db.cadastro.findMany({
    orderBy: { criadoEm: 'asc' },
    where,
    select: {
      criadoEm: true,
      protocolo: true,
      nome: true,
      cpf: true,
      participantes: {
        select: {
          nome: true,
          documento: true,
        }
      }
    }
  });

  const headers = [
    "Data",
    "ID",
    "Nome Principal",
    "CPF Principal",
    "Nome Participante",
    "CPF Participante",
  ];
  
  const rows: (string | null)[][] = [];
  cadastros.map((cadastro) => {
    if (cadastro.participantes && cadastro.participantes.length > 0) {
      cadastro.participantes.map(participante => {
        rows.push([
          `${cadastro.criadoEm}`,
          cadastro.protocolo,
          cadastro.nome,
          cadastro.cpf,
          `${participante.nome}`,
          `${participante.documento}`,
        ]);
      });
    } else {
      rows.push([
        `${cadastro.criadoEm}`,
        cadastro.protocolo,
        cadastro.nome,
        cadastro.cpf,
        "-",
        "-",
      ]);
    }
  });

  return { headers, rows };
}

async function buscarAvaliacoesExportacao({ busca, documentosEnviados, projetosEnviados, tipoInscricao, avaliacao }: { busca?: string, documentosEnviados?: string, projetosEnviados?: string, tipoInscricao?: string, avaliacao?: string }): Promise<{ headers: string[], rows: (string | null | undefined)[][] }> {
  interface some {
    tipo?: any;
  }

  interface none {
    tipo?: any
  }
  interface arquivos {
    none?: none,
    some?: some
  }
  let arquivos: arquivos = {};
  let AND: any[] = [];

  if (documentosEnviados === "true" || projetosEnviados === "true") {
    if (documentosEnviados === "true" && projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" || projetosEnviados === "false") {
    if (documentosEnviados === "false" && projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "true" && projetosEnviados === "false") {
    arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" && projetosEnviados === "true") {
    arquivos.some = { tipo: TipoArquivo.PROJETOS }
    arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
  }

  if (arquivos.some) AND.push({ arquivos: { some: arquivos.some }});
  if (arquivos.none) AND.push({ arquivos: { none: arquivos.none }});

  const where: any = {
    ...(busca && {
        OR: [
            { nome: { contains: busca } },
            { email: { contains: busca } },
            { cnpj: { contains: busca } },
            { cpf: { contains: busca } },
        ],
    }),
    ...(AND.length > 0 && { AND }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: null } }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: "" } }),
    ...(tipoInscricao === "PF" && { 
      OR: [
        { cnpj: null },
        { cnpj: "" }
      ]
    }),
    ...(avaliacao === "AGUARDANDO" && { avaliacao_licitadora: null }),
    ...(avaliacao === "DEFERIDO" && { avaliacao_licitadora: { liberadoAval: true } }),
    ...(avaliacao === "INDEFERIDO" && { avaliacao_licitadora: { liberadoAval: false } }),
  }

  const cadastros = await db.cadastro.findMany({
    orderBy: { criadoEm: 'asc' },
    where: {
      avaliacao_licitadora: {
        aprovado: true,
        liberadoAval: true,
      }
    },
    select: {
      id: true,
      protocolo: true,
      avaliacoes_julgadora: {
        include: {
          avaliador: true,
        }
      }
    }
  });

  const headers = [
    "ID",
    "Média Final",
    "Status",
    "Observação",
    "Mencão Honrosa",
    "Avaliador",
    "Linha Temática 1",
    "Linha Temática 2",
    "Linha Temática 3",
    "Parcial 1",
    "Conceito Projetual",
    "Atendimento Normas",
    "Inserção Urbana",
    "Qualidade Funcional",
    "Exequibilidade",
    "Economicidade",
    "Qualidade Gráfica",
    "Parcial 2",
    "Média Avaliador",
  ];
  
  const rows: (string | null)[][] = [];
  cadastros.map((cadastro) => {
    if (cadastro.avaliacoes_julgadora && cadastro.avaliacoes_julgadora.length > 0) {
      const avals: string[][] = [];
      let avaliacoesTotal = 0;
      let avaliacoesQuant = 0;
      cadastro.avaliacoes_julgadora.map(avaliacao => {
        const parcial1 = (avaliacao.linhaTematica1 || 0) + (avaliacao.linhaTematica2 || 0) + (avaliacao.linhaTematica3 || 0);
        const media1 = parcial1 / 3;
        const parcial2 = (avaliacao.conceitoProjetual || 0) + (avaliacao.atendimentoNormas || 0) + (avaliacao.insercaoUrbana || 0) + (avaliacao.qualidadeFuncional || 0) + (avaliacao.exequibilidade || 0) + (avaliacao.economicidade || 0) + (avaliacao.qualidadeGrafica || 0);
        const media2 = parcial2 / 7;
        const mediaAvaliador = (parcial1 + parcial2)/10;
        avaliacoesTotal += mediaAvaliador;
        if (mediaAvaliador > 0) avaliacoesQuant++;
        avals.push([
          cadastro.protocolo || "",
          "",
          avaliacao.desclassificado ? "Desclassificado" : avaliacao.avaliado ? "Avaliado" : "Em avaliação",
          avaliacao.observacoes || "",
          avaliacao.mencao_honrosa ? "Sim" : "Não",
          avaliacao.avaliador?.nome || "",
          `${avaliacao.linhaTematica1 || 0}`,
          `${avaliacao.linhaTematica2 || 0}`,
          `${avaliacao.linhaTematica3 || 0}`,
          `${media1.toFixed(2)}`,
          `${avaliacao.conceitoProjetual || 0}`,
          `${avaliacao.atendimentoNormas || 0}`,
          `${avaliacao.insercaoUrbana || 0}`,
          `${avaliacao.qualidadeFuncional || 0}`,
          `${avaliacao.exequibilidade || 0}`,
          `${avaliacao.economicidade || 0}`,
          `${avaliacao.qualidadeGrafica || 0}`,
          `${media2.toFixed(2)}`,
          `${mediaAvaliador.toFixed(2)}`,
        ]);
      });
      for (let i = 0; i < avals.length; i++) avals[i][1] = `${(avaliacoesTotal / avaliacoesQuant).toFixed(2)}`;
      if (avals.length > 0) rows.push(...avals);
    } else {
      rows.push([
        cadastro.protocolo,
        "",
        "Não avaliado",
        "",
        "",
        "",
      ]);
    }
  });

  return { headers, rows };
}

async function buscarArquivosExportacao({ busca, documentosEnviados, projetosEnviados, tipoInscricao, novos }: { busca?: string, documentosEnviados?: string, projetosEnviados?: string, tipoInscricao?: string, novos?: boolean }): Promise<{ headers: string[], rows: (string | null | undefined)[][] }> {
  const dataAberturaComplementar = new Date("2025-09-26 08:00:00")
  const dataLimiteComplementar = new Date("2025-09-26 12:00:00")
  interface some {
    tipo?: any;
  }

  interface none {
    tipo?: any
  }
  interface arquivos {
    none?: none,
    some?: some
  }
  let arquivos: arquivos = {};
  let AND: any[] = [];

  if (documentosEnviados === "true" || projetosEnviados === "true") {
    if (documentosEnviados === "true" && projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "true")
      arquivos.some = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" || projetosEnviados === "false") {
    if (documentosEnviados === "false" && projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA || TipoArquivo.PROJETOS }
    else if (documentosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
    else if (projetosEnviados === "false")
      arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "true" && projetosEnviados === "false") {
    arquivos.some = { tipo: TipoArquivo.DOC_ESPECIFICA }
    arquivos.none = { tipo: TipoArquivo.PROJETOS }
  }

  if (documentosEnviados === "false" && projetosEnviados === "true") {
    arquivos.some = { tipo: TipoArquivo.PROJETOS }
    arquivos.none = { tipo: TipoArquivo.DOC_ESPECIFICA }
  }

  if (arquivos.some) AND.push({ arquivos: { some: arquivos.some }});
  if (arquivos.none) AND.push({ arquivos: { none: arquivos.none }});

  const where: any = {
    ...(busca && {
        OR: [
            { nome: { contains: busca } },
            { email: { contains: busca } },
            { cnpj: { contains: busca } },
            { cpf: { contains: busca } },
        ],
    }),
    ...(AND.length > 0 && { AND }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: null } }),
    ...(tipoInscricao === "PJ" && { cnpj: { not: "" } }),
    ...(tipoInscricao === "PF" && { 
      OR: [
        { cnpj: null },
        { cnpj: "" }
      ]
    }),
  }

  const cadastros = await db.cadastro.findMany({
    orderBy: { criadoEm: 'asc' },
    where,
    select: {
      criadoEm: true,
      protocolo: true,
      arquivos: {
        select: {
          caminho: true,
          criadoEm: true,
          tipo: true,
        },
        orderBy: {
          criadoEm: 'asc',
        },
        where: {
          ...(novos && {
            criadoEm: {
              gte: dataAberturaComplementar,
              lte: dataLimiteComplementar,
            }
          })
        }
      }
    }
  });

  const headers = [
    "Data Inscrição",
    "ID",
    "Nome Arquivo",
    "Tipo Arquivo",
    "Data do Arquivo",
  ];
  
  const rows: (string | null)[][] = [];
  cadastros.map((cadastro) => {
    if (cadastro.arquivos && cadastro.arquivos.length > 0) {
      cadastro.arquivos.map(arquivo => {
        rows.push([
          `${cadastro.criadoEm}`,
          cadastro.protocolo,
          arquivo.caminho,
          arquivo.tipo,
          `${arquivo.criadoEm}`,
        ]);
      });
    } else {
      rows.push([
        `${cadastro.criadoEm}`,
        cadastro.protocolo,
        "Nenhum arquivo enviado",
        "",
        "",
      ]);
    }
  });

  return { headers, rows };
}

export interface ICadastroBusca extends Cadastro {
  participantes: Participante[];
  arquivos: Arquivo[];
  avaliacao_licitadora?: Avaliacao_Licitadora;
}

async function buscarCadastro(id: number): Promise<ICadastroBusca | null> {
  const cadastro = await db.cadastro.findUnique({
    where: { id },
    include: {
      participantes: true,
      arquivos: true,
      avaliacao_licitadora: true,
    }
  });
  return cadastro as ICadastroBusca | null;
}

async function buscarCadastroJulgadora(id: number, avaliadorId: string) {
  const cadastro = await db.cadastro.findUnique({
    where: { id },
    select: {
      protocolo: true,
      arquivos: {
        where: {
          tipo: TipoArquivo.PROJETOS,
        },
        select: {
          id: true,
          caminho: true,
          tipo: true,
          criadoEm: true
        }
      },
      avaliacoes_julgadora: {
        select: {
          id: true,
          linhaTematica1: true,
          linhaTematica2: true,
          linhaTematica3: true,
          conceitoProjetual: true,
          atendimentoNormas: true,
          insercaoUrbana: true,
          qualidadeFuncional: true,
          exequibilidade: true,
          economicidade: true,
          qualidadeGrafica: true,
          observacoes: true,
          desclassificado: true,
          mencao_honrosa: true,
          avaliado: true,
          criadoEm: true,
          atualizadoEm: true,
        },
        where: { avaliadorId }
      }
    }
  });
  return cadastro;
}

export { buscarArquivosExportacao, buscarAvaliacoesExportacao, buscarParticipantesExportacao, emailsParticipantes, emailsAprovados, geraProtocolo, buscarCadastro, buscarCadastroJulgadora, buscarCadastrosExportacao, criarPreCadastro, meuCadastro, buscarCadastros, criarAvaliacaoLicitadora, atualizarAvaliacaoLicitadora };
