import { NextResponse } from 'next/server';
import { dbRaw } from '@/lib/prisma';

export async function GET() {
  try {
    // Testa conexão com banco de dados (sem auditoria para evitar loop)
    await dbRaw.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        application: 'running'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 503 });
  }
}
