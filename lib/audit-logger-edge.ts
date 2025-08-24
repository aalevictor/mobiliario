// Versão do AuditLogger compatível com Edge Runtime
// Não importamos do Prisma para evitar problemas com Edge Runtime

// Tipos como strings para evitar dependência do Prisma
type TipoLog = 'DATABASE_OPERATION' | 'ERROR' | 'AUTH' | 'API_REQUEST' | 'SYSTEM';
type NivelLog = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

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

export class AuditLoggerEdge {
  private static getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  static async log(data: LogData) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/api/internal/audit-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Erro ao registrar log:', await response.text());
      }
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error);
    }
  }

  static async logError(
    erro: string,
    stackTrace?: string,
    nivel: NivelLog = 'ERROR',
    endpoint?: string,
    metodo?: string,
    usuario?: string,
    ip?: string,
    userAgent?: string
  ) {
    return this.log({
      tipo: 'ERROR',
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
      tipo: 'API_REQUEST',
      nivel: 'INFO',
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
    nivel: NivelLog = 'INFO'
  ) {
    return this.log({
      tipo: 'AUTH',
      nivel,
      operacao,
      usuario,
      ip,
      userAgent,
    });
  }
}
