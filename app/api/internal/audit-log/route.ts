import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/audit-logger';
import { TipoLog, NivelLog } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Usar o AuditLogger original que tem acesso ao banco
    await AuditLogger.log({
      tipo: data.tipo as TipoLog,
      nivel: data.nivel as NivelLog,
      operacao: data.operacao,
      tabela: data.tabela,
      registroId: data.registroId,
      dadosAntes: data.dadosAntes,
      dadosDepois: data.dadosDepois,
      usuario: data.usuario,
      ip: data.ip,
      userAgent: data.userAgent,
      erro: data.erro,
      stackTrace: data.stackTrace,
      duracao: data.duracao,
      endpoint: data.endpoint,
      metodo: data.metodo,
      headers: data.headers,
      query: data.query,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar log de auditoria:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
