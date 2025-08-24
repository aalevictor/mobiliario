import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from './audit-logger';
import { NivelLog } from '@prisma/client';

export interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

export class GlobalErrorHandler {
  static async handleApiError(
    error: ErrorWithStatus,
    request: NextRequest,
    endpoint?: string
  ): Promise<NextResponse> {
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Determinar nível do erro
    let nivel = NivelLog.ERROR;
    const status = error.status || error.statusCode || 500;
    
    if (status >= 500) {
      nivel = NivelLog.ERROR;
    } else if (status >= 400) {
      nivel = NivelLog.ERROR;
    }

    // Extrair informações do usuário se disponível
    let usuario: string | undefined;
    try {
      // Aqui você pode implementar a extração do usuário da sessão/token
      // Por exemplo, se usando JWT ou sessão
      usuario = await this.extractUserFromRequest(request);
    } catch {
      // Se não conseguir extrair usuário, continua sem
    }

    // Registrar erro no log de auditoria
    await AuditLogger.logError(
      error.message,
      error.stack,
      nivel,
      endpoint || request.url,
      request.method,
      usuario,
      ip,
      userAgent
    );

    // Retornar resposta apropriada
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      {
        error: true,
        message: status >= 500 && !isDevelopment ? 'Erro interno do servidor' : error.message,
        ...(isDevelopment && { stack: error.stack }),
        timestamp: new Date().toISOString(),
      },
      { status }
    );
  }

  static async handleUnhandledError(error: Error, context?: string) {
    // Para erros não tratados do sistema
    await AuditLogger.logError(
      `Erro não tratado${context ? ` em ${context}` : ''}: ${error.message}`,
      error.stack,
      NivelLog.CRITICAL,
      context
    );
  }

  private static async extractUserFromRequest(request: NextRequest): Promise<string | undefined> {
    // Implementar extração de usuário baseado na sua estratégia de autenticação
    // Exemplo com NextAuth:
    /*
    try {
      const token = await getToken({ req: request });
      return token?.sub || token?.email;
    } catch {
      return undefined;
    }
    */
    
    // Por enquanto, tentar extrair de headers ou cookies
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      // Se usar Bearer token, você pode decodificar aqui
      return 'authenticated-user';
    }
    
    return undefined;
  }
}

// Wrapper para funções de API que automaticamente captura erros
export function withErrorHandling(
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error('Erro capturado pelo error handler:', error);
      
      if (error instanceof Error) {
        return await GlobalErrorHandler.handleApiError(
          error as ErrorWithStatus,
          request
        );
      }
      
      // Se não for uma instância de Error, criar uma
      const unknownError = new Error(`Erro desconhecido: ${error}`) as ErrorWithStatus;
      unknownError.status = 500;
      
      return await GlobalErrorHandler.handleApiError(unknownError, request);
    }
  };
}

// Para capturar erros não tratados globalmente
if (typeof window === 'undefined') {
  // Lado servidor
  process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    GlobalErrorHandler.handleUnhandledError(error, 'unhandledRejection');
  });

  process.on('uncaughtException', (error) => {
    GlobalErrorHandler.handleUnhandledError(error, 'uncaughtException');
    // Em produção, você pode querer terminar o processo após logar
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
}
