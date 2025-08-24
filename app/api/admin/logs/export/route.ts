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
    return NextResponse.json({ error: 'Acesso negado. Apenas usuários DEV podem exportar logs.' }, { status: 403 });
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
      usuario?: string | undefined;
      tabela?: string | undefined;
      dataInicio?: Date;
      dataFim?: Date;
    } = {
      page: 1,
      limit: parseInt(searchParams.get('limit') || '1000'), // Limite maior para export
    };

    // Filtros opcionais
    if (searchParams.get('tipo')) {
      filters.tipo = searchParams.get('tipo') as TipoLog;
    }
    
    if (searchParams.get('nivel')) {
      filters.nivel = searchParams.get('nivel') as NivelLog;
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
      
      // Converter para CSV
      const csvHeaders = [
        'ID',
        'Data/Hora',
        'Tipo',
        'Nível',
        'Operação',
        'Tabela',
        'ID Registro',
        'Usuário',
        'IP',
        'Endpoint',
        'Método',
        'Duração (ms)',
        'Erro',
        'Email Enviado'
      ];
      
      const csvRows = result.logs.map(log => [
        log.id,
        new Date(log.criadoEm).toLocaleString('pt-BR'),
        log.tipo,
        log.nivel,
        log.operacao || '',
        log.tabela || '',
        log.registroId || '',
        log.usuario || '',
        log.ip || '',
        log.endpoint || '',
        log.metodo || '',
        log.duracao || '',
        log.erro ? `"${log.erro.replace(/"/g, '""')}"` : '', // Escape quotes para CSV
        log.emailEnviado ? 'Sim' : 'Não'
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
      
      // Log da exportação
      await AuditLogger.logAuth(
        'EXPORTACAO_LOGS',
        (session.user as User).id,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.headers.get('user-agent') || '',
        NivelLog.INFO
      );

      // Retornar CSV
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="logs-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      return NextResponse.json(
        { error: 'Erro interno ao exportar logs' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
}

export const GET = withErrorHandling(handler);
