/** @format */

import { Permissao, Prisma, TipoArquivo, Tipo_Usuario } from "@prisma/client";
import { db } from "@/lib/prisma";
import { PreCadastro } from "@/app/api/cadastro/pre-cadastro.dto";
import { hashPassword } from "@/lib/password";
import { gerarSenha, verificaLimite, verificaPagina } from "@/lib/utils";
import { IAvaliacaoLicitadora } from "@/app/api/cadastro/[id]/avaliacao-licitadora/route";
import { transporter } from "@/lib/nodemailer";
import { templateBoasVindasCoordenacao, templateBoasVindasParticipante } from "@/app/api/cadastro/_utils/email-templates";
import { Logger } from "@/lib/logger";

function geraProtocolo(id: number) {
  const mascara = 17529 * id ** 2 + 85474;
  const chave1 = 7458321;
  const chave2 = 13874219;
  const protocolo = ((mascara + chave1) ^ chave2).toString();
  return `MOB-2025-${protocolo.padStart(10, "0")}`;
}

async function criarPreCadastro(
  preCadastro: PreCadastro,
  contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
): Promise<any> {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    const preCadastroSaved = await db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const { participantes, ...data } = preCadastro;
        const senha = gerarSenha();
        const senhaHashed = hashPassword(senha);
        
        // Criar usuário
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

        // Log de criação do usuário
        await Logger.logCriacao("USUARIO", novo_usuario.id, {
          nome: novo_usuario.nome,
          email: novo_usuario.email,
          tipo: novo_usuario.tipo,
          permissao: novo_usuario.permissao
        }, usuarioId, ip, userAgent);

        const { cnpj, ...data_cadastro } = { ...data };
        const novo_cadastro = await tx.cadastro.create({
          data: { 
            ...data_cadastro, 
            usuarioId: novo_usuario.id,
            cnpj: (cnpj && cnpj.trim() !== "") ? cnpj : null
          }
        });

        // Log de criação do cadastro
        await Logger.logCriacao("CADASTRO", novo_cadastro.id.toString(), {
          nome: novo_cadastro.nome,
          email: novo_cadastro.email,
          cpf: novo_cadastro.cpf,
          cnpj: novo_cadastro.cnpj,
          carteira_tipo: novo_cadastro.carteira_tipo,
          carteira_numero: novo_cadastro.carteira_numero,
          equipe: novo_cadastro.equipe
        }, usuarioId, ip, userAgent);

        try {
          // Criar participantes se for equipe
          if (preCadastro.equipe && participantes && participantes.length > 0) {
            await tx.participante.createMany({
              data: participantes.map((participante) => ({
                ...participante,
                cadastroId: novo_cadastro.id,
              })),
            });

            // Log de criação dos participantes
            await Logger.logOperacaoLote("CREATE", "PARTICIPANTE", participantes.length, usuarioId, ip, userAgent);
          }

          // Gerar e atualizar protocolo
          const protocolo = geraProtocolo(novo_cadastro.id);
          const cadastro_protocolo = await tx.cadastro.update({
            where: { id: novo_cadastro.id },
            data: { protocolo }
          });

          // Log de atualização do protocolo
          await Logger.logAtualizacao("CADASTRO", novo_cadastro.id.toString(), 
            { protocolo: null }, 
            { protocolo }, 
            usuarioId, ip, userAgent
          );

          if (cadastro_protocolo) {
            if (!transporter) {
              console.warn('⚠️  Não foi possível enviar email: SMTP não configurado');
              
              // Log de aviso sobre SMTP não configurado
              await Logger.logCustomizado({
                acao: "WARNING",
                entidade: "EMAIL",
                mensagem: "SMTP não configurado - email não enviado",
                nivel: "WARNING",
                usuarioId,
                ip,
                userAgent
              });
              
              return cadastro_protocolo;
            }

            try {
              // Enviar emails
              await transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: data.email,
                subject: 'PRÉ-INSCRIÇÃO REGISTRADA',
                html: templateBoasVindasParticipante(data.nome, protocolo, senha),
              });
              
              await transporter.sendMail({
                from: process.env.MAIL_FROM,
                to: process.env.MAIL_BCC,
                subject: 'PRÉ-INSCRIÇÃO REGISTRADA',
                html: templateBoasVindasCoordenacao(protocolo),
              });

              // Log de envio de emails
              await Logger.logCustomizado({
                acao: "EMAIL",
                entidade: "CADASTRO",
                entidadeId: novo_cadastro.id.toString(),
                mensagem: `Emails enviados com sucesso para ${data.email} e coordenação`,
                nivel: "INFO",
                usuarioId,
                ip,
                userAgent
              });

            } catch (emailError) {
              console.error('Erro ao enviar email:', emailError);
              
              // Log de erro no envio de email
              await Logger.logErro("Falha no envio de emails", emailError as Error, {
                entidade: "CADASTRO",
                entidadeId: novo_cadastro.id.toString(),
                usuarioId,
                ip,
                userAgent
              });
              
              // Não falha o cadastro se o email falhar
            }
          }
          
          return cadastro_protocolo;
        } catch (error) {
          // Log de erro durante a criação
          await Logger.logErro("Erro durante criação de cadastro", error as Error, {
            entidade: "CADASTRO",
            usuarioId,
            ip,
            userAgent
          });

          // Rollback em caso de erro
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
  } catch (error) {
    // Log de erro geral
    await Logger.logErro("Falha crítica na criação de pré-cadastro", error as Error, {
      entidade: "CADASTRO",
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}

async function meuCadastro(id: string, contexto?: { usuarioId?: string; ip?: string; userAgent?: string }) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    const cadastro = await db.cadastro.findUnique({ 
      where: { usuarioId: id },
      include: { 
        participantes: true,
        arquivos: true,
      }
    });

    if (cadastro) {
      // Log de acesso ao cadastro
      await Logger.logAcesso("MEU_CADASTRO", id, true, "Consulta de cadastro pessoal", ip, userAgent);
    } else {
      // Log de tentativa de acesso a cadastro inexistente
      await Logger.logAcesso("MEU_CADASTRO", id, false, "Cadastro não encontrado", ip, userAgent);
    }

    return cadastro;
  } catch (error) {
    // Log de erro na consulta
    await Logger.logErro("Erro ao consultar cadastro pessoal", error as Error, {
      entidade: "CADASTRO",
      usuarioId: id,
      ip,
      userAgent
    });
    
    throw error;
  }
}

async function buscarCadastros(
  permissao: Permissao,
  pagina: number = 1,
  limite: number = 10,
  busca?: string,
  contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
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

    // Log de consulta de cadastros
    await Logger.logAcesso("BUSCAR_CADASTROS", usuarioId || "SISTEMA", true, 
      `Consulta de ${cadastros.length} cadastros (página ${pagina}, total: ${total})`, ip, userAgent
    );

    return {
        total: +total,
        pagina: +pagina,
        limite: +limite,
        data: cadastros,
    };
  } catch (error) {
    // Log de erro na consulta
    await Logger.logErro("Erro ao buscar cadastros", error as Error, {
      entidade: "CADASTRO",
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}

async function criarAvaliacaoLicitadora(
  id: number, 
  avaliadorId: string, 
  data: IAvaliacaoLicitadora,
  contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    const avaliacao_licitadora = await db.avaliacao_Licitadora.create({
      data: {
        ...data,
        cadastroId: id,
        avaliadorId,
      },
    });

    // Log de criação da avaliação
    await Logger.logCriacao("AVALIACAO_LICITADORA", avaliacao_licitadora.id, {
      cadastroId: id,
      avaliadorId,
      parecer: data.parecer,
      aprovado: data.aprovado,
      observacoes: data.observacoes
    }, usuarioId, ip, userAgent);

    return avaliacao_licitadora;
  } catch (error) {
    // Log de erro na criação
    await Logger.logErro("Erro ao criar avaliação licitadora", error as Error, {
      entidade: "AVALIACAO_LICITADORA",
      entidadeId: id.toString(),
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}

async function atualizarAvaliacaoLicitadora(
  id: string, 
  avaliadorId: string, 
  data: IAvaliacaoLicitadora,
  contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    // Buscar dados antes da atualização
    const avaliacaoAntes = await db.avaliacao_Licitadora.findUnique({
      where: { id },
      select: { parecer: true, aprovado: true, observacoes: true }
    });

    const avaliacao_licitadora = await db.avaliacao_Licitadora.update({
      where: { id },
      data: { ...data, avaliadorId },
    });

    // Log de atualização da avaliação
    await Logger.logAtualizacao("AVALIACAO_LICITADORA", id, 
      avaliacaoAntes as object, 
      {
        parecer: data.parecer,
        aprovado: data.aprovado,
        observacoes: data.observacoes,
        avaliadorId
      }, 
      usuarioId, ip, userAgent
    );

    return avaliacao_licitadora;
  } catch (error) {
    // Log de erro na atualização
    await Logger.logErro("Erro ao atualizar avaliação licitadora", error as Error, {
      entidade: "AVALIACAO_LICITADORA",
      entidadeId: id,
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}

async function buscarCadastro(
  id: number,
  contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    const cadastro = await db.cadastro.findUnique({
      where: { id },
      include: {
        participantes: true,
        arquivos: true,
      }
    });

    if (cadastro) {
      // Log de acesso ao cadastro
      await Logger.logAcesso("BUSCAR_CADASTRO", usuarioId || "SISTEMA", true, 
        `Consulta do cadastro ${id}`, ip, userAgent
      );
    } else {
      // Log de tentativa de acesso a cadastro inexistente
      await Logger.logAcesso("BUSCAR_CADASTRO", usuarioId || "SISTEMA", false, 
        `Cadastro ${id} não encontrado`, ip, userAgent
      );
    }

    return cadastro;
  } catch (error) {
    // Log de erro na consulta
    await Logger.logErro("Erro ao buscar cadastro", error as Error, {
      entidade: "CADASTRO",
      entidadeId: id.toString(),
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}

async function buscarCadastroJulgadora(
  id: number,
  contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
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

    if (cadastro) {
      // Log de acesso ao cadastro pela julgadora
      await Logger.logAcesso("BUSCAR_CADASTRO_JULGADORA", usuarioId || "SISTEMA", true, 
        `Consulta do cadastro ${id} pela julgadora`, ip, userAgent
      );
    } else {
      // Log de tentativa de acesso a cadastro inexistente
      await Logger.logAcesso("BUSCAR_CADASTRO_JULGADORA", usuarioId || "SISTEMA", false, 
        `Cadastro ${id} não encontrado pela julgadora`, ip, userAgent
      );
    }

    return cadastro;
  } catch (error) {
    // Log de erro na consulta
    await Logger.logErro("Erro ao buscar cadastro para julgadora", error as Error, {
      entidade: "CADASTRO",
      entidadeId: id.toString(),
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}

export { geraProtocolo, buscarCadastro, buscarCadastroJulgadora, criarPreCadastro, meuCadastro, buscarCadastros, criarAvaliacaoLicitadora, atualizarAvaliacaoLicitadora };
