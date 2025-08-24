import { NextRequest, NextResponse } from 'next/server';
import { transporter } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { logId, adminEmail, data } = await request.json();
    
    if (!adminEmail || !transporter) {
      console.warn('MAIL_ADMIN não configurado ou transporter não disponível para envio de erro crítico');
      return NextResponse.json({ error: 'Email não configurado' }, { status: 400 });
    }

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
          🚨 ERRO CRÍTICO DETECTADO
        </h2>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Detalhes do Erro</h3>
          <p><strong>ID do Log:</strong> ${logId}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p><strong>Tipo:</strong> ${data.tipo}</p>
          <p><strong>Endpoint:</strong> ${data.endpoint || 'N/A'}</p>
          <p><strong>Método:</strong> ${data.metodo || 'N/A'}</p>
          <p><strong>Usuário:</strong> ${data.usuario || 'N/A'}</p>
          <p><strong>IP:</strong> ${data.ip || 'N/A'}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Erro</h3>
          <pre style="background-color: #ffffff; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px;">${data.erro}</pre>
        </div>

        ${data.stackTrace ? `
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Stack Trace</h3>
          <pre style="background-color: #ffffff; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 10px;">${data.stackTrace}</pre>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p>Este email foi enviado automaticamente pelo sistema de monitoramento de erros.</p>
          <p>Para visualizar mais detalhes, acesse o painel administrativo de logs.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: `🚨 ERRO CRÍTICO - ${data.endpoint || 'Sistema'} - ${new Date().toLocaleString('pt-BR')}`,
      html: emailHTML,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar email de erro crítico:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
