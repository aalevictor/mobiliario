import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/audit-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, days, maxLogs } = body;

    let removedCount = 0;

    switch (type) {
      case 'by-days':
        removedCount = await AuditLogger.cleanupOldLogs(days || 30);
        break;
        
      case 'by-count':
        removedCount = await AuditLogger.cleanupLogsByCount(maxLogs || 10000);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Tipo de limpeza inválido. Use "by-days" ou "by-count"' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Limpeza concluída. ${removedCount} logs removidos.`,
      removedCount
    });

  } catch (error) {
    console.error('Erro na limpeza de logs:', error);
    return NextResponse.json(
      { error: 'Erro interno ao limpar logs' },
      { status: 500 }
    );
  }
}

// GET para estatísticas antes da limpeza
export async function GET() {
  try {
    const stats = await AuditLogger.getLogStats();
    
    return NextResponse.json({
      ...stats,
      recomendacao: stats.totalLogs > 50000 
        ? 'Recomenda-se limpeza por quantidade'
        : stats.totalLogs > 10000
        ? 'Considere limpeza por data'
        : 'Limpeza não necessária no momento'
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
