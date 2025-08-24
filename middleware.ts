import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rotas que devem ser logadas
const LOGGED_ROUTES = [
  '/api/cadastro',
  '/api/usuario',
  '/api/duvida',
  '/api/logs',
  '/api/permissao',
  '/api/ldap'
];

// Rotas que não devem ser logadas (muito frequentes)
const IGNORED_ROUTES = [
  '/api/auth',
  '/api/email-teste/status',
  '/_next',
  '/favicon.ico',
  '/health'
];

// Métodos HTTP que devem ser logados
const LOGGED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;
  
  // Verificar se deve logar esta rota
  const shouldLog = LOGGED_ROUTES.some(route => pathname.startsWith(route)) &&
                   !IGNORED_ROUTES.some(route => pathname.startsWith(route));

  let usuarioId: string | undefined;
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || '';

  // Capturar informações do usuário se estiver autenticado
  if (shouldLog) {
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.AUTH_SECRET 
      });
      
      if (token?.id) {
        usuarioId = token.id as string;
      }
    } catch (error) {
      // Ignorar erro de token - usuário não autenticado
    }
  }

  // Continuar com a requisição
  const response = NextResponse.next();

  // Logar após a resposta (apenas para rotas relevantes)
  if (shouldLog) {
    const duration = Date.now() - start;
    const statusCode = response.status;
    const method = request.method;

    // Capturar headers relevantes (filtrar dados sensíveis)
    const relevantHeaders: any = {};
    const headerKeys = ['content-type', 'content-length', 'accept', 'origin'];
    headerKeys.forEach(key => {
      const value = request.headers.get(key);
      if (value) relevantHeaders[key] = value;
    });

    // Log detalhado para operações de escrita ou erros
    if (LOGGED_METHODS.includes(method) || statusCode >= 400) {
      // Determinar nível do log
      let nivel = 'INFO';
      if (statusCode >= 500) {
        nivel = 'ERROR';
      } else if (statusCode >= 400) {
        nivel = 'WARNING';
      }

      // Enviar dados para API interna de logging (compatível com Edge Runtime)
      const logData = {
        tipo: 'API_REQUEST',
        nivel,
        endpoint: pathname,
        metodo: method,
        usuario: usuarioId,
        ip,
        userAgent,
        headers: relevantHeaders,
        duracao: duration,
        statusCode,
        isError: statusCode >= 400
      };

      // Usar fetch para enviar log (compatível com Edge Runtime)
      fetch(`${request.nextUrl.origin}/api/internal/middleware-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      }).catch(error => {
        console.error('Erro ao registrar log:', error);
      });
    }
  }

  // Adicionar headers úteis para debugging
  response.headers.set('X-Response-Time', `${Date.now() - start}ms`);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
