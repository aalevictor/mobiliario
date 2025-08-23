import { db } from "@/lib/prisma";
import { NivelLog } from "@prisma/client";

export interface ICreateLog {
  acao: string;
  entidade: string;
  entidadeId?: string;
  dadosAntes?: any;
  dadosDepois?: any;
  mensagem: string;
  nivel?: NivelLog;
  usuarioId?: string;
  ip?: string;
  userAgent?: string;
  erro?: string;
  stackTrace?: string;
}

export interface ILog {
  id: string;
  acao: string;
  entidade: string;
  entidadeId?: string | null;
  dadosAntes?: any;
  dadosDepois?: any;
  mensagem: string;
  nivel: NivelLog;
  usuarioId?: string;
  ip?: string;
  userAgent?: string;
  erro?: string;
  stackTrace?: string;
  criadoEm: Date;
  usuario?: {
    nome: string;
    email: string;
  };
}

export interface ILogsPaginados {
  pagina: number;
  limite: number;
  total: number;
  data: ILog[];
}

export class LogService {
  /**
   * Cria um novo log no sistema
   */
  static async criarLog(logData: ICreateLog): Promise<ILog> {
    try {
      const log = await db.log.create({
        data: {
          ...logData,
          dadosAntes: logData.dadosAntes ? JSON.stringify(logData.dadosAntes) : undefined,
          dadosDepois: logData.dadosDepois ? JSON.stringify(logData.dadosDepois) : undefined,
        },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
            },
          },
        },
      });

      return {
        ...log,
        usuarioId: log.usuarioId || undefined,
        entidadeId: log.entidadeId || undefined,
        ip: log.ip || undefined,
        userAgent: log.userAgent || undefined,
        erro: log.erro || undefined,
        stackTrace: log.stackTrace || undefined,
        usuario: log.usuario || undefined,
        dadosAntes: log.dadosAntes ? JSON.parse(log.dadosAntes as string) : undefined,
        dadosDepois: log.dadosDepois ? JSON.parse(log.dadosDepois as string) : undefined,
      };
    } catch (error) {
      console.error("Erro ao criar log:", error);
      throw error;
    }
  }

  /**
   * Busca logs com paginação e filtros
   */
  static async buscarLogs(
    pagina: number = 1,
    limite: number = 20,
    filtros?: {
      acao?: string;
      entidade?: string;
      nivel?: NivelLog | "_all";
      usuarioId?: string;
      dataInicio?: Date;
      dataFim?: Date;
      busca?: string;
    }
  ): Promise<ILogsPaginados> {
    try {
      const where: any = {};

      if (filtros?.acao) {
        where.acao = filtros.acao === "_all" ? undefined : { contains: filtros.acao, mode: 'insensitive' };
      }

      if (filtros?.entidade) {
        where.entidade = { contains: filtros.entidade, mode: 'insensitive' };
      }

      if (filtros?.nivel) {
        where.nivel = filtros.nivel === "_all" ? undefined : filtros.nivel;
      }

      if (filtros?.usuarioId) {
        where.usuarioId = filtros.usuarioId;
      }

      if (filtros?.dataInicio || filtros?.dataFim) {
        where.criadoEm = {};
        if (filtros.dataInicio) {
          where.criadoEm.gte = filtros.dataInicio;
        }
        if (filtros.dataFim) {
          where.criadoEm.lte = filtros.dataFim;
        }
      }

      if (filtros?.busca) {
        where.OR = [
          { mensagem: { contains: filtros.busca, mode: 'insensitive' } },
          { entidade: { contains: filtros.busca, mode: 'insensitive' } },
          { acao: { contains: filtros.busca, mode: 'insensitive' } },
        ];
      }

      const [total, logs] = await Promise.all([
        db.log.count({ where }),
        db.log.findMany({
          where,
          skip: (pagina - 1) * limite,
          take: limite,
          orderBy: { criadoEm: 'desc' },
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
              },
            },
          },
        }),
      ]);

      return {
        pagina,
        limite,
        total,
        data: logs.map(log => ({
          ...log,
          usuarioId: log.usuarioId || undefined,
          entidadeId: log.entidadeId || undefined,
          ip: log.ip || undefined,
          userAgent: log.userAgent || undefined,
          erro: log.erro || undefined,
          stackTrace: log.stackTrace || undefined,
          usuario: log.usuario || undefined,
          dadosAntes: log.dadosAntes ? JSON.parse(log.dadosAntes as string) : undefined,
          dadosDepois: log.dadosDepois ? JSON.parse(log.dadosDepois as string) : undefined,
        })),
      };
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      throw error;
    }
  }

  /**
   * Busca um log específico por ID
   */
  static async buscarLogPorId(id: string): Promise<ILog | null> {
    try {
      const log = await db.log.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
            },
          },
        },
      });

      if (!log) return null;

      return {
        ...log,
        usuarioId: log.usuarioId || undefined,
        entidadeId: log.entidadeId || undefined,
        ip: log.ip || undefined,
        userAgent: log.userAgent || undefined,
        erro: log.erro || undefined,
        stackTrace: log.stackTrace || undefined,
        usuario: log.usuario || undefined,
        dadosAntes: log.dadosAntes ? JSON.parse(log.dadosAntes as string) : undefined,
        dadosDepois: log.dadosDepois ? JSON.parse(log.dadosDepois as string) : undefined,
      };
    } catch (error) {
      console.error("Erro ao buscar log por ID:", error);
      throw error;
    }
  }

  /**
   * Limpa logs antigos (mais de X dias)
   */
  static async limparLogsAntigos(dias: number = 90): Promise<number> {
    try {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);

      const resultado = await db.log.deleteMany({
        where: {
          criadoEm: {
            lt: dataLimite,
          },
        },
      });

      return resultado.count;
    } catch (error) {
      console.error("Erro ao limpar logs antigos:", error);
      throw error;
    }
  }

  /**
   * Métodos auxiliares para logs comuns
   */
  static async logCriacao(
    entidade: string,
    entidadeId: string,
    dados: any,
    usuarioId?: string,
    ip?: string,
    userAgent?: string
  ) {
    return this.criarLog({
      acao: "CREATE",
      entidade,
      entidadeId,
      dadosDepois: dados,
      mensagem: `Criação de ${entidade}`,
      nivel: "INFO",
      usuarioId,
      ip,
      userAgent,
    });
  }

  static async logAtualizacao(
    entidade: string,
    entidadeId: string,
    dadosAntes: any,
    dadosDepois: any,
    usuarioId?: string,
    ip?: string,
    userAgent?: string
  ) {
    return this.criarLog({
      acao: "UPDATE",
      entidade,
      entidadeId,
      dadosAntes,
      dadosDepois,
      mensagem: `Atualização de ${entidade}`,
      nivel: "INFO",
      usuarioId,
      ip,
      userAgent,
    });
  }

  static async logExclusao(
    entidade: string,
    entidadeId: string,
    dados: any,
    usuarioId?: string,
    ip?: string,
    userAgent?: string
  ) {
    return this.criarLog({
      acao: "DELETE",
      entidade,
      entidadeId,
      dadosAntes: dados,
      mensagem: `Exclusão de ${entidade}`,
      nivel: "WARNING",
      usuarioId,
      ip,
      userAgent,
    });
  }

  static async logErro(
    mensagem: string,
    erro: Error,
    contexto?: {
      entidade?: string;
      entidadeId?: string;
      usuarioId?: string;
      ip?: string;
      userAgent?: string;
    }
  ) {
    return this.criarLog({
      acao: "ERROR",
      entidade: contexto?.entidade || "SISTEMA",
      entidadeId: contexto?.entidadeId,
      mensagem,
      nivel: "ERROR",
      usuarioId: contexto?.usuarioId,
      ip: contexto?.ip,
      userAgent: contexto?.userAgent,
      erro: erro.message,
      stackTrace: erro.stack,
    });
  }

  static async logLogin(
    usuarioId: string,
    sucesso: boolean,
    ip?: string,
    userAgent?: string
  ) {
    return this.criarLog({
      acao: "LOGIN",
      entidade: "USUARIO",
      entidadeId: usuarioId,
      mensagem: sucesso ? "Login realizado com sucesso" : "Tentativa de login falhou",
      nivel: sucesso ? "INFO" : "WARNING",
      usuarioId,
      ip,
      userAgent,
    });
  }
}
