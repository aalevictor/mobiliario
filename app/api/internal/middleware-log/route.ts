import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/audit-logger';
import { TipoLog, NivelLog } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Converter strings para enums
    const tipo = data.tipo as TipoLog;
    const nivel = data.nivel as NivelLog;
    
    // Log da requisição API
    await AuditLogger.logApiRequest(
      data.endpoint,
      data.metodo,
      data.usuario,
      data.ip,
      data.userAgent,
      data.headers,
      data.duracao
    );
    
    // Se for erro, logar também como erro
    if (data.isError) {
      await AuditLogger.logError(
        `Erro HTTP ${data.statusCode}: ${data.metodo} ${data.endpoint}`,
        tipo,
        nivel,
        data.endpoint,
        data.metodo,
        data.usuario,
        data.ip,
        data.userAgent
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar log do middleware:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
