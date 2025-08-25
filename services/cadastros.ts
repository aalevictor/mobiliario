/** @format */

import { NivelLog, Permissao, Prisma, TipoArquivo, Tipo_Usuario } from "@prisma/client";
import { db } from "@/lib/prisma";
import { PreCadastro } from "@/app/api/cadastro/pre-cadastro.dto";
import { hashPassword } from "@/lib/password";
import { gerarSenha, verificaLimite, verificaPagina } from "@/lib/utils";
import { IAvaliacaoLicitadora } from "@/app/api/cadastro/[id]/avaliacao-licitadora/route";
import { getCurrentUserForEmail } from "@/lib/email-logger";
import { templateBoasVindasCoordenacao, templateBoasVindasParticipante } from "@/app/api/cadastro/_utils/email-templates";
import { AuditLogger } from "@/lib/audit-logger";

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
        if (preCadastro.equipe && participantes && participantes.length > 0)
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
              html: templateBoasVindasParticipante(protocolo, data.nome, senha),
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

async function meuCadastro(id: string) {
  const cadastro = await db.cadastro.findUnique({ 
    where: { usuarioId: id },
    include: { 
      participantes: true,
      arquivos: true,
    }
  });
  return cadastro;
}

async function buscarCadastros(
  permissao: Permissao,
  pagina: number = 1,
  limite: number = 10,
  busca?: string,
) {
  [pagina, limite] = verificaPagina(pagina, limite);
  const select = ["ADMIN", "DEV"].includes(permissao) ? {
    id: true,
    protocolo: true,
    email: true,
    nome: true,
    cnpj: true,
    cpf: true,
    carteira_tipo: true,
    carteira_numero: true,
    equipe: true,
    logradouro: true,
    numero: true,
    complemento: true,
    cep: true,
    cidade: true,
    uf: true,
    avaliacao_licitadora: {
      select: {
        id: true,
        parecer: true,
        aprovado: true,
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
      }
    }
  }: ["JULGADORA"].includes(permissao)	?  {
    id: true,
    protocolo: true,
    arquivos: {
      where: {
        tipo: TipoArquivo.DOC_ESPECIFICA,
      },
      select: {
        id: true,
        caminho: true,
        tipo: true,
        criadoEm: true
      }
    }
  }: { id: true };
  const searchParams = {
    ...(busca && {
        OR: [
            { nome: { contains: busca } },
            { email: { contains: busca } },
            { cnpj: { contains: busca } },
            { cpf: { contains: busca } },
        ],
    }),
  };
  const total = await db.cadastro.count({ where: searchParams });
  if (total == 0) return { total: 0, pagina: 0, limite: 0, data: [] };
  [pagina, limite] = verificaLimite(pagina, limite, total);
  const cadastros = await db.cadastro.findMany({
      where: searchParams,
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

async function buscarCadastro(id: number) {
  const cadastro = await db.cadastro.findUnique({
    where: { id },
    include: {
      participantes: true,
      arquivos: true,
    }
  });
  return cadastro;
}

async function buscarCadastroJulgadora(id: number) {
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
    }
  });
  return cadastro;
}

export { geraProtocolo, buscarCadastro, buscarCadastroJulgadora, criarPreCadastro, meuCadastro, buscarCadastros, criarAvaliacaoLicitadora, atualizarAvaliacaoLicitadora };
