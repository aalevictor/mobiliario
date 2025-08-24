import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/audit-logger';
import { Permissao } from '@prisma/client';
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
    return NextResponse.json({ error: 'Acesso negado. Apenas usuários DEV podem acessar estatísticas de logs.' }, { status: 403 });
  }

  if (request.method === 'GET') {
    try {
      const stats = await AuditLogger.getLogStats();
      return NextResponse.json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos logs:', error);
      return NextResponse.json(
        { error: 'Erro interno ao buscar estatísticas' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
}

export const GET = withErrorHandling(handler);
