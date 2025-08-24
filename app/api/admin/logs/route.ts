import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/audit-logger';
import { TipoLog, NivelLog, Permissao } from '@prisma/client';
import { withErrorHandling } from '@/lib/error-handler';
import { auth } from '@/auth';
import { User } from 'next-auth';

async function handler(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // Verificar se o usuário tem permissão DEV
  const userPermission = (session.user as User).permissao;
  if (userPermission !== Permissao.DEV) {
    await AuditLogger.logAuth(
      'TENTATIVA_ACESSO_LOGS_NAO_AUTORIZADO',
      (session.user as User).id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || '',
      NivelLog.WARNING
    );
    
    return NextResponse.json({ error: 'Acesso negado. Apenas usuários DEV podem acessar logs.' }, { status: 403 });
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Extrair parâmetros de filtro
    const filters: {
      page: number;
      limit: number;
      tipo?: TipoLog;
      nivel?: NivelLog;
      usuario?: string;
      tabela?: string;
      dataInicio?: Date;
      dataFim?: Date;
    } = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Filtros opcionais
    if (searchParams.get('tipo')) {
      filters.tipo = searchParams.get('tipo') as TipoLog || 'ALL';
    }
    
    if (searchParams.get('nivel')) {
      filters.nivel = searchParams.get('nivel') as NivelLog || 'ALL';
    }
    
    if (searchParams.get('usuario')) {
      filters.usuario = searchParams.get('usuario') || undefined;
    }
    
    if (searchParams.get('tabela')) {
      filters.tabela = searchParams.get('tabela') || undefined;
    }
    
    if (searchParams.get('dataInicio')) {
      filters.dataInicio = new Date(searchParams.get('dataInicio')!);
    }
    
    if (searchParams.get('dataFim')) {
      filters.dataFim = new Date(searchParams.get('dataFim')!);
    }

    try {
      const result = await AuditLogger.getLogs(filters);
      
      // Log do acesso aos logs
      await AuditLogger.logAuth(
        'ACESSO_LOGS_ADMIN',
        (session.user as User).id,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent') || '',
        NivelLog.INFO
      );

      return NextResponse.json(result);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return NextResponse.json(
        { error: 'Erro interno ao buscar logs' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
}

export const GET = withErrorHandling(handler);
