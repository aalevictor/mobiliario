import { TipoLog, NivelLog } from "@prisma/client";
import { dbRaw } from "./prisma";

export interface LogData {
  tipo: TipoLog;
  nivel: NivelLog;
  operacao?: string;
  tabela?: string;
  registroId?: string;
  dadosAntes?: object;
  dadosDepois?: object;
  usuario?: string;
  ip?: string;
  userAgent?: string;
  erro?: string;
  stackTrace?: string;
  duracao?: number;
  endpoint?: string;
  metodo?: string;  
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  headers?: any;
  query?: string;
}

export class AuditLogger {
  static async log(data: LogData) {
    try {
      const log = await dbRaw.logAuditoria.create({
        data: {
          ...data,
          dadosAntes: data.dadosAntes ? JSON.stringify(data.dadosAntes) : undefined,
          dadosDepois: data.dadosDepois ? JSON.stringify(data.dadosDepois) : undefined,
          headers: data.headers ? JSON.stringify(data.headers) : undefined,
          emailEnviado: false,
        }
      });

      // Se for erro crítico, enviar email
      if (data.nivel === NivelLog.CRITICAL) {
        await this.sendCriticalErrorEmail(log.id, data);
      }

      return log;
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error);
      // Em caso de erro ao registrar o log, pelo menos logamos no console
      console.error('Dados do log que falhou:', data);
    }
  }

  static async logDatabaseOperation(
    operacao: string,
    tabela: string,
    registroId?: string,
    dadosAntes?: object,
    dadosDepois?: object,
    usuario?: string,
    duracao?: number,
    query?: string
  ) {
    return this.log({
      tipo: TipoLog.DATABASE_OPERATION,
      nivel: NivelLog.INFO,
      operacao,
      tabela,
      registroId,
      dadosAntes,
      dadosDepois,
      usuario,
      duracao,
      query,
    });
  }

  static async logError(
    erro: string,
    stackTrace?: string,
    nivel: NivelLog = NivelLog.ERROR,
    endpoint?: string,
    metodo?: string,
    usuario?: string,
    ip?: string,
    userAgent?: string
  ) {
    return this.log({
      tipo: TipoLog.ERROR,
      nivel,
      erro,
      stackTrace,
      endpoint,
      metodo,
      usuario,
      ip,
      userAgent,
    });
  }

  static async logApiRequest(
    endpoint: string,
    metodo: string,
    usuario?: string,
    ip?: string,
    userAgent?: string,
    //eslint-disable-next-line  @typescript-eslint/no-explicit-any
    headers?: any,
    duracao?: number
  ) {
    return this.log({
      tipo: TipoLog.API_REQUEST,
      nivel: NivelLog.INFO,
      endpoint,
      metodo,
      usuario,
      ip,
      userAgent,
      headers,
      duracao,
    });
  }

  static async logAuth(
    operacao: string,
    usuario?: string,
    ip?: string,
    userAgent?: string,
    nivel: NivelLog = NivelLog.INFO
  ) {
    return this.log({
      tipo: TipoLog.AUTH,
      nivel,
      operacao,
      usuario,
      ip,
      userAgent,
    });
  }

  private static async sendCriticalErrorEmail(logId: string, data: LogData) {
    const adminEmail = process.env.MAIL_ADMIN;
    
    if (!adminEmail) {
      console.warn('MAIL_ADMIN não configurado para envio de erro crítico');
      return;
    }

    try {
      // Usar fetch para chamar API de envio de email
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/internal/send-critical-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logId,
          adminEmail,
          data,
        }),
      });

      if (response.ok) {
        // Marcar email como enviado
        await dbRaw.logAuditoria.update({
          where: { id: logId },
          data: { emailEnviado: true }
        });

        console.log(`Email de erro crítico enviado para ${adminEmail} - Log ID: ${logId}`);
      } else {
        console.error('Falha ao enviar email de erro crítico');
      }
    } catch (error) {
      console.error('Erro ao enviar email de erro crítico:', error);
    }
  }

  // Método para buscar logs com filtros
  static async getLogs(filters: {
    tipo?: TipoLog | 'ALL';
    nivel?: NivelLog | 'ALL';
    usuario?: string;
    tabela?: string;
    dataInicio?: Date;
    dataFim?: Date;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 50, ...where } = filters;
    const skip = (page - 1) * limit;

    //eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (where.tipo) whereClause.tipo = where.tipo === 'ALL' ? undefined : where.tipo;
    if (where.nivel) whereClause.nivel = where.nivel === 'ALL' ? undefined : where.nivel;
    if (where.usuario) whereClause.usuario = { contains: where.usuario };
    if (where.tabela) whereClause.tabela = where.tabela;
    
    if (where.dataInicio || where.dataFim) {
      whereClause.criadoEm = {};
      if (where.dataInicio) whereClause.criadoEm.gte = where.dataInicio;
      if (where.dataFim) whereClause.criadoEm.lte = where.dataFim;
    }

    const [logs, total] = await Promise.all([
      dbRaw.logAuditoria.findMany({
        where: whereClause,
        orderBy: { criadoEm: 'desc' },
        skip,
        take: limit,
      }),
      dbRaw.logAuditoria.count({ where: whereClause }),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Método para estatísticas dos logs
  static async getLogStats() {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);
    
    const ultimaSemana = new Date(hoje);
    ultimaSemana.setDate(hoje.getDate() - 7);

    const [
      totalLogs,
      logsHoje,
      logsOntem,
      logsSemana,
      errosCriticos,
      erroresPorTipo,
    ] = await Promise.all([
      dbRaw.logAuditoria.count(),
      dbRaw.logAuditoria.count({
        where: { criadoEm: { gte: new Date(hoje.setHours(0, 0, 0, 0)) } }
      }),
      dbRaw.logAuditoria.count({
        where: { 
          criadoEm: { 
            gte: new Date(ontem.setHours(0, 0, 0, 0)),
            lt: new Date(hoje.setHours(0, 0, 0, 0))
          } 
        }
      }),
      dbRaw.logAuditoria.count({
        where: { criadoEm: { gte: ultimaSemana } }
      }),
      dbRaw.logAuditoria.count({
        where: { nivel: NivelLog.CRITICAL }
      }),
      dbRaw.logAuditoria.groupBy({
        by: ['tipo', 'nivel'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
    ]);

    return {
      totalLogs,
      logsHoje,
      logsOntem,
      logsSemana,
      errosCriticos,
      erroresPorTipo,
    };
  }
}
