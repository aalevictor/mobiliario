import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from './audit-logger';
import { NivelLog } from '@prisma/client';

export interface ErrorLogContext {
  endpoint: string;
  metodo: string;
  usuario?: string;
  ip?: string;
  userAgent?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: any;
}

/**
 * Wrapper para APIs com logging automático de erros
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorLogging<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  context: Omit<ErrorLogContext, 'ip' | 'userAgent'>
) {
  return async (...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    let request: NextRequest | undefined;
    
    // Tentar extrair request do primeiro argumento se for NextRequest
    if (args[0] && typeof args[0] === 'object' && 'url' in args[0]) {
      request = args[0] as NextRequest;
    }

    try {
      // Log de início da operação (opcional, apenas para operações críticas)
      if (context.endpoint.includes('cadastro') || context.endpoint.includes('avaliacao')) {
        await AuditLogger.log({
          tipo: 'API_REQUEST',
          nivel: NivelLog.INFO,
          operacao: 'API_START',
          endpoint: context.endpoint,
          metodo: context.metodo,
          usuario: context.usuario,
          ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown',
          userAgent: request?.headers.get('user-agent') || 'unknown',
          duracao: 0
        });
      }

      // Executar handler original
      const result = await handler(...args);
      const duracao = Date.now() - startTime;

      // Log de sucesso para operações importantes
      if (result.status >= 200 && result.status < 300) {
        await AuditLogger.log({
          tipo: 'API_REQUEST',
          nivel: NivelLog.INFO,
          operacao: 'API_SUCCESS',
          endpoint: context.endpoint,
          metodo: context.metodo,
          usuario: context.usuario,
          ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown',
          userAgent: request?.headers.get('user-agent') || 'unknown',
          duracao
        });
      }

      return result;

    } catch (error) {
      const duracao = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Determinar nível do erro baseado no tipo
      let nivel: NivelLog = NivelLog.ERROR;
      if (errorMessage.includes('CRITICAL') || errorMessage.includes('FATAL')) {
        nivel = NivelLog.CRITICAL as NivelLog;
      } else if (errorMessage.includes('WARNING') || errorMessage.includes('WARN')) {
        nivel = NivelLog.WARNING as NivelLog;
      }

      // Log detalhado do erro
      await AuditLogger.logError(
        `Erro na API ${context.endpoint}: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
        nivel,
        context.endpoint,
        context.metodo,
        context.usuario,
        request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown',
         request?.headers.get('user-agent') || 'unknown'
      );

      // Log adicional com contexto da requisição
      await AuditLogger.log({
        tipo: 'ERROR',
        nivel,
        operacao: 'API_ERROR',
        endpoint: context.endpoint,
        metodo: context.metodo,
        erro: errorMessage,
        stackTrace: error instanceof Error ? error.stack : undefined,
        usuario: context.usuario,
        ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown',
        userAgent: request?.headers.get('user-agent') || 'unknown',
        headers: request ? Object.fromEntries(request.headers.entries()) : undefined,
        duracao
      });

      console.error(`❌ Erro na API ${context.endpoint}:`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        duracao: `${duracao}ms`,
        usuario: context.usuario
      });

      // Retornar resposta de erro padronizada
      return NextResponse.json(
        {
          error: 'Erro interno do servidor',
          message: process.env.NODE_ENV === 'development' ? errorMessage : 'Algo deu errado',
          timestamp: new Date().toISOString(),
          endpoint: context.endpoint
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Decorator para operações de banco de dados
 */
export async function withDatabaseErrorLogging<T>(
  operation: () => Promise<T>,
  context: {
    operacao: string;
    tabela: string;
    usuario?: string;
  }
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    const duracao = Date.now() - startTime;

    // Log de sucesso apenas para operações críticas
    if (context.operacao === 'CREATE' || context.operacao === 'DELETE') {
      await AuditLogger.log({
        tipo: 'DATABASE_OPERATION',
        nivel: NivelLog.INFO,
        operacao: context.operacao,
        tabela: context.tabela,
        usuario: context.usuario,
        duracao
      });
    }

    return result;

  } catch (error) {
    const duracao = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    // Log do erro de banco
    await AuditLogger.logError(
      `Erro de banco na tabela ${context.tabela} (${context.operacao}): ${errorMessage}`,
      error instanceof Error ? error.stack : undefined,
      NivelLog.ERROR,
      `database/${context.tabela}`,
      context.operacao,
      context.usuario
    );

    console.error(`❌ Erro de banco de dados:`, {
      tabela: context.tabela,
      operacao: context.operacao,
      error: errorMessage,
      duracao: `${duracao}ms`
    });

    throw error;
  }
}

/**
 * Wrapper para operações críticas de sistema
 */
export async function withCriticalOperationLogging<T>(
  operation: () => Promise<T>,
  context: {
    operacao: string;
    descricao: string;
    usuario?: string;
  }
): Promise<T> {
  const startTime = Date.now();
  
  // Log de início da operação crítica
  await AuditLogger.log({
    tipo: 'SYSTEM',
    nivel: NivelLog.INFO,
    operacao: `${context.operacao}_START`,
    usuario: context.usuario,
    duracao: 0
  });

  try {
    const result = await operation();
    const duracao = Date.now() - startTime;

    // Log de sucesso
    await AuditLogger.log({
      tipo: 'SYSTEM',
      nivel: NivelLog.INFO,
      operacao: `${context.operacao}_SUCCESS`,
      usuario: context.usuario,
      duracao
    });

    console.log(`✅ Operação crítica concluída: ${context.descricao} (${duracao}ms)`);
    return result;

  } catch (error) {
    const duracao = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    // Log crítico de falha
    await AuditLogger.logError(
      `🚨 FALHA EM OPERAÇÃO CRÍTICA: ${context.descricao} - ${errorMessage}`,
      error instanceof Error ? error.stack : undefined,
      NivelLog.CRITICAL,
      `system/${context.operacao}`,
      'CRITICAL_OPERATION',
      context.usuario
    );

    console.error(`🚨 Falha crítica em: ${context.descricao}`, {
      error: errorMessage,
      duracao: `${duracao}ms`,
      stack: error instanceof Error ? error.stack : undefined
    });

    throw error;
  }
}

/**
 * Helper para extrair informações do usuário da requisição
 */
export function extractUserFromRequest(request: NextRequest): string | undefined {
  // Esta função pode ser expandida para pegar usuário de headers, JWT, etc.
  const authHeader = request.headers.get('authorization');
  const userHeader = request.headers.get('x-user-id');
  
  if (userHeader) return userHeader;
  if (authHeader) {
    // Aqui poderia decodificar JWT para pegar user ID
    return 'authenticated_user';
  }
  
  return undefined;
}
