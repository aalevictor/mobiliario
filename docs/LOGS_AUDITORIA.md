# Sistema de Logs de Auditoria

Este documento descreve o sistema completo de logs auditáveis implementado na aplicação.

## Visão Geral

O sistema de auditoria registra automaticamente:
- ✅ Todas as operações do banco de dados (CREATE, UPDATE, DELETE)
- ✅ Erros e exceções do sistema
- ✅ Requisições de API importantes
- ✅ Eventos de autenticação e autorização
- ✅ Envio automático de email para erros críticos

## Componentes Implementados

### 1. Modelo de Dados (`LogAuditoria`)

```sql
-- Tabela criada no banco de dados
CREATE TABLE logs_auditoria (
  id VARCHAR(36) PRIMARY KEY,
  tipo ENUM('DATABASE_OPERATION', 'ERROR', 'AUTH', 'API_REQUEST', 'SYSTEM'),
  nivel ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL'),
  operacao VARCHAR(255),     -- CREATE, UPDATE, DELETE, etc.
  tabela VARCHAR(255),       -- Nome da tabela afetada
  registro_id VARCHAR(255),  -- ID do registro afetado
  dados_antes JSON,          -- Estado anterior (para UPDATE/DELETE)
  dados_depois JSON,         -- Estado posterior (para CREATE/UPDATE)
  usuario VARCHAR(255),      -- ID ou login do usuário
  ip VARCHAR(255),
  user_agent TEXT,
  erro TEXT,                 -- Detalhes do erro
  stack_trace TEXT,          -- Stack trace completo
  duracao INT,               -- Duração da operação em ms
  endpoint VARCHAR(255),     -- Endpoint da API
  metodo VARCHAR(10),        -- GET, POST, PUT, DELETE
  headers JSON,              -- Headers relevantes
  query TEXT,                -- Query SQL (se aplicável)
  email_enviado BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Sistema de Logging (`AuditLogger`)

**Localização:** `lib/audit-logger.ts`

#### Métodos principais:

```typescript
// Log genérico
AuditLogger.log(data: LogData)

// Log de operações do banco de dados
AuditLogger.logDatabaseOperation(operacao, tabela, registroId, dadosAntes, dadosDepois, usuario, duracao, query)

// Log de erros
AuditLogger.logError(erro, stackTrace, nivel, endpoint, metodo, usuario, ip, userAgent)

// Log de requisições de API
AuditLogger.logApiRequest(endpoint, metodo, usuario, ip, userAgent, headers, duracao)

// Log de autenticação
AuditLogger.logAuth(operacao, usuario, ip, userAgent, nivel)
```

### 3. Middleware de Banco de Dados

**Localização:** `lib/prisma-audit.ts`

Intercepta automaticamente todas as operações do Prisma:
- Captura estado anterior dos registros (para UPDATE/DELETE)
- Registra duração das operações
- Loga erros de banco de dados

**Uso:**
```typescript
import { db } from '@/lib/prisma'; // Usa versão com auditoria

// Todas as operações são automaticamente logadas
const usuario = await db.usuario.create({ data: {...} });
```

### 4. Middleware HTTP Global

**Localização:** `middleware.ts`

Intercepta automaticamente:
- Todas as requisições para rotas importantes
- Erros HTTP (4xx, 5xx)
- Informações de performance (duração)
- Dados do usuário autenticado

### 5. Tratamento de Erros Globais

**Localização:** `lib/error-handler.ts`

#### Wrapper para APIs:
```typescript
import { withErrorHandling } from '@/lib/error-handler';

async function handler(request: NextRequest) {
  // Sua lógica da API aqui
}

export const POST = withErrorHandling(handler);
```

### 6. Tela Administrativa de Logs

**Localização:** `/logs` (apenas para usuários DEV)

#### Funcionalidades:
- 📊 Dashboard com estatísticas
- 🔍 Filtros avançados (tipo, nível, usuário, data, etc.)
- 📋 Visualização detalhada de cada log
- 📥 Exportação para CSV
- ⚡ Filtros rápidos para cenários comuns
- 🚨 Seção específica para erros críticos

## Configuração

### 1. Variáveis de Ambiente

Adicione ao seu `.env`:

```env
# Email para notificações de erros críticos
MAIL_ADMIN=dev-admin@spurbanismo.sp.gov.br

# Configurações SMTP já existentes
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app
MAIL_FROM="naoresponda-mobiliariourbano@spurbanismo.sp.gov.br"
```

### 2. Banco de Dados

Execute a migration para criar a tabela:

```bash
npx prisma migrate dev --name add-audit-logs
npx prisma generate
```

## Como Usar

### 1. Em APIs (Recomendado)

```typescript
import { withErrorHandling } from '@/lib/error-handler';
import { AuditLogger } from '@/lib/audit-logger';
import { NivelLog } from '@prisma/client';

async function handler(request: NextRequest) {
  const session = await auth();
  
  // Log de tentativa de acesso
  await AuditLogger.logAuth(
    'ACESSO_ENDPOINT',
    session?.user?.id,
    request.headers.get('x-forwarded-for'),
    request.headers.get('user-agent'),
    NivelLog.INFO
  );
  
  // Sua lógica aqui...
}

export const POST = withErrorHandling(handler);
```

### 2. Log Manual de Erros

```typescript
import { AuditLogger } from '@/lib/audit-logger';
import { NivelLog } from '@prisma/client';

try {
  // Operação que pode falhar
} catch (error) {
  await AuditLogger.logError(
    `Erro específico: ${error.message}`,
    error.stack,
    NivelLog.CRITICAL, // Enviará email automático
    '/minha-rota',
    'POST',
    userId
  );
}
```

### 3. Log de Operações Específicas

```typescript
// Log de login bem-sucedido
await AuditLogger.logAuth(
  'LOGIN_SUCESSO',
  user.id,
  request.ip,
  request.userAgent,
  NivelLog.INFO
);

// Log de operação sensível
await AuditLogger.logAuth(
  'ALTERACAO_PERMISSAO',
  adminUserId,
  request.ip,
  request.userAgent,
  NivelLog.WARNING
);
```

## Níveis de Log

- **INFO**: Operações normais, sucessos
- **WARNING**: Situações que merecem atenção
- **ERROR**: Erros que afetam funcionalidades
- **CRITICAL**: Erros graves que **enviam email automático**

## Tipos de Log

- **DATABASE_OPERATION**: Operações CRUD no banco
- **ERROR**: Erros e exceções
- **AUTH**: Autenticação e autorização
- **API_REQUEST**: Requisições HTTP
- **SYSTEM**: Eventos do sistema

## Email de Erros Críticos

Quando um log de nível **CRITICAL** é registrado:

1. ✅ Email é enviado automaticamente para `MAIL_ADMIN`
2. ✅ Contém detalhes completos do erro
3. ✅ Inclui stack trace se disponível
4. ✅ Flag `emailEnviado` é marcada como `true`

### Template do Email:
- 🚨 Assunto com timestamp
- 📋 Detalhes do erro
- 🔍 Stack trace
- 🌐 Informações de contexto (IP, usuário, endpoint)

## Acesso à Tela de Logs

### Permissões:
- ✅ **DEV**: Acesso completo a todos os logs
- ❌ **ADMIN**: Sem acesso aos logs
- ❌ **Outros**: Sem acesso

### URL: `/logs`

### Funcionalidades da Tela:
1. **Dashboard**: Estatísticas e gráficos
2. **Logs**: Lista paginada com filtros
3. **Erros Críticos**: Seção específica para erros graves

## Monitoramento Automático

O sistema monitora automaticamente:

### 🔄 Operações do Banco:
- Todas as operações via Prisma são logadas
- Estado anterior e posterior é capturado
- Duração é medida

### 🌐 Requisições HTTP:
- APIs importantes são monitoradas
- Erros HTTP são capturados
- Performance é medida

### 🔐 Autenticação:
- Tentativas de login
- Acessos não autorizados
- Mudanças de permissão

### ⚠️ Erros:
- Exceções não tratadas
- Erros de banco de dados
- Falhas de API

## Performance

### Otimizações implementadas:
- ✅ Logs usam instância separada do Prisma (evita recursão)
- ✅ Operações de log são assíncronas (não bloqueiam)
- ✅ Índices no banco para consultas rápidas
- ✅ Middleware só loga rotas importantes
- ✅ Dados sensíveis são filtrados

### Índices criados:
```sql
CREATE INDEX idx_logs_tipo ON logs_auditoria(tipo);
CREATE INDEX idx_logs_nivel ON logs_auditoria(nivel);
CREATE INDEX idx_logs_criado_em ON logs_auditoria(criado_em);
CREATE INDEX idx_logs_usuario ON logs_auditoria(usuario);
CREATE INDEX idx_logs_tabela ON logs_auditoria(tabela);
```

## Segurança

### Dados protegidos:
- ❌ Senhas nunca são logadas
- ❌ Tokens de autenticação são filtrados
- ❌ Dados pessoais sensíveis são mascarados
- ✅ Apenas headers relevantes são capturados

### Acesso restrito:
- ✅ Apenas usuários DEV podem acessar logs
- ✅ Tentativas de acesso não autorizado são logadas
- ✅ Exportação é auditada

## Manutenção

### Limpeza periódica (recomendada):
```sql
-- Manter apenas logs dos últimos 6 meses
DELETE FROM logs_auditoria 
WHERE criado_em < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### Backup de logs importantes:
```sql
-- Exportar erros críticos para análise
SELECT * FROM logs_auditoria 
WHERE nivel = 'CRITICAL' 
ORDER BY criado_em DESC;
```

## Troubleshooting

### 1. Emails não estão sendo enviados:
- Verificar variáveis SMTP no `.env`
- Verificar variável `MAIL_ADMIN`
- Checar logs do sistema

### 2. Logs não aparecem na tela:
- Verificar permissão DEV do usuário
- Verificar se tabela foi criada (migration)
- Checar logs do browser (console)

### 3. Performance impactada:
- Verificar se índices foram criados
- Considerar limpeza de logs antigos
- Verificar se middleware está logando demais

### 4. Recursão infinita em logs:
- Verificar se está usando `dbRaw` para logs
- Não usar `db` auditado dentro do AuditLogger

## Exemplo de Implementação Completa

```typescript
// app/api/exemplo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/error-handler';
import { AuditLogger } from '@/lib/audit-logger';
import { auth } from '@/auth';
import { db } from '@/lib/prisma';
import { NivelLog } from '@prisma/client';

async function handler(request: NextRequest) {
  const session = await auth();
  
  if (!session) {
    await AuditLogger.logAuth(
      'ACESSO_NAO_AUTORIZADO',
      undefined,
      request.headers.get('x-forwarded-for'),
      request.headers.get('user-agent'),
      NivelLog.WARNING
    );
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    // Operação no banco (automaticamente logada pelo middleware)
    const resultado = await db.minhaTabela.create({
      data: { /* dados */ }
    });

    // Log de sucesso específico
    await AuditLogger.logAuth(
      'OPERACAO_CONCLUIDA',
      session.user.id,
      request.headers.get('x-forwarded-for'),
      request.headers.get('user-agent'),
      NivelLog.INFO
    );

    return NextResponse.json({ resultado });
  } catch (error) {
    // Log de erro (já feito pelo withErrorHandling, mas pode fazer específico)
    await AuditLogger.logError(
      `Falha na operação específica: ${error}`,
      error instanceof Error ? error.stack : undefined,
      NivelLog.ERROR,
      '/api/exemplo',
      'POST',
      session.user.id
    );
    
    throw error; // Re-throw para o withErrorHandling capturar
  }
}

export const POST = withErrorHandling(handler);
```

---

## 🎯 Resumo dos Benefícios

✅ **Auditoria Completa**: Todas as operações são rastreadas
✅ **Monitoramento Automático**: Erros são detectados e notificados
✅ **Interface Amigável**: Tela administrativa intuitiva
✅ **Exportação de Dados**: CSV para análises externas
✅ **Segurança**: Acesso restrito e dados protegidos
✅ **Performance**: Otimizado para não impactar o sistema
✅ **Alertas**: Emails automáticos para erros críticos
