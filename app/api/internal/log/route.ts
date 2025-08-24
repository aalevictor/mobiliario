import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/audit-logger';
import { TipoLog, NivelLog } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Converter strings para enums
    const tipo = data.type as TipoLog;
    const nivel = data.level as NivelLog;
    
    if (tipo === 'API_REQUEST') {
      await AuditLogger.logApiRequest(
        data.endpoint,
        data.method,
        data.usuario,
        data.ip,
        data.userAgent,
        data.headers,
        data.duration
      );
    }
    
    // Se for erro, logar também como erro
    if (data.statusCode >= 400) {
      await AuditLogger.logError(
        `Erro HTTP ${data.statusCode}: ${data.method} ${data.endpoint}`,
        undefined,
        nivel,
        data.endpoint,
        data.method,
        data.usuario,
        data.ip,
        data.userAgent
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar log interno:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
