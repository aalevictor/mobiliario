# 🔄 Correção do Loop de Logs de Auditoria

## 🚨 Problema Identificado

O sistema estava gerando logs excessivos devido a um **loop de auditoria**:

### 🔍 Causas do Loop:

1. **Health Check com Auditoria**
   - Health check executava a cada 30 segundos
   - Usava `db` (com auditoria) em vez de `dbRaw`
   - Gerava ~120 logs/hora só do health check

2. **Logs Auditando a Si Mesmos**
   - Sistema auditava operações na tabela `LogAuditoria`
   - Cada inserção de log gerava outro log
   - Loop infinito de auditoria

3. **Operações de Estatísticas**
   - Consultas frequentes para estatísticas
   - Todas sendo auditadas desnecessariamente

## ✅ Correções Implementadas

### 1. **Health Check Sem Auditoria**
```typescript
// ANTES (problemático)
import { db } from '@/lib/prisma';
await db.$queryRaw`SELECT 1`;

// DEPOIS (corrigido)  
import { dbRaw } from '@/lib/prisma';
await dbRaw.$queryRaw`SELECT 1`;
```

### 2. **Exclusão da Tabela de Logs da Auditoria**
```typescript
// Adicionado filtro para evitar loop
if (model !== 'LogAuditoria') {
  await AuditLogger.logDatabaseOperation(/* ... */);
}
```

### 3. **Funções de Limpeza de Logs**
```typescript
// Limpeza por data (manter últimos 30 dias)
AuditLogger.cleanupOldLogs(30);

// Limpeza por quantidade (manter últimos 10.000 logs)
AuditLogger.cleanupLogsByCount(10000);
```

### 4. **API de Limpeza Administrativa**
- **Endpoint:** `/api/admin/logs/cleanup`
- **GET:** Estatísticas e recomendações
- **POST:** Executa limpeza

## 🎯 Resultados Esperados

### Antes das Correções:
- ❌ ~120 logs/hora só do health check
- ❌ Logs auditando logs (loop infinito)
- ❌ Crescimento exponencial de registros
- ❌ Performance degradada

### Após as Correções:
- ✅ Health check sem logs desnecessários
- ✅ Sem loop de auto-auditoria
- ✅ Crescimento controlado de logs
- ✅ Performance melhorada
- ✅ Ferramenta de limpeza automática

## 🛠️ Como Usar a Limpeza

### Via API (Administrador):

```bash
# Verificar estatísticas
curl http://localhost:3500/api/admin/logs/cleanup

# Limpeza por data (últimos 30 dias)
curl -X POST http://localhost:3500/api/admin/logs/cleanup \
  -H "Content-Type: application/json" \
  -d '{"type": "by-days", "days": 30}'

# Limpeza por quantidade (manter 10.000)  
curl -X POST http://localhost:3500/api/admin/logs/cleanup \
  -H "Content-Type: application/json" \
  -d '{"type": "by-count", "maxLogs": 10000}'
```

### Via Container:

```bash
# Limpeza manual no container
docker-compose exec moburb-app node -e "
const { AuditLogger } = require('./lib/audit-logger');
AuditLogger.cleanupOldLogs(30).then(count => 
  console.log(\`\${count} logs removidos\`)
);
"
```

## 📊 Tipos de Logs que Permanecerão

### ✅ **Logs Importantes (Mantidos):**
- Operações de usuários (login, CRUD)
- Erros da aplicação
- Operações críticas do sistema
- Logs de nível CRITICAL (nunca removidos)

### ❌ **Logs Desnecessários (Removidos):**
- Health checks repetitivos
- Auto-auditoria de logs
- Operações internas de estatísticas
- Logs antigos (> 30 dias por padrão)

## 🔧 Configurações Recomendadas

### Para Ambiente de Produção:
```typescript
// Executar limpeza semanalmente
// Manter últimos 30 dias OU máximo 50.000 logs
AuditLogger.cleanupOldLogs(30);
AuditLogger.cleanupLogsByCount(50000);
```

### Para Ambiente de Desenvolvimento:
```typescript
// Limpeza mais agressiva
// Manter últimos 7 dias OU máximo 1.000 logs
AuditLogger.cleanupOldLogs(7);
AuditLogger.cleanupLogsByCount(1000);
```

## ⚠️ Logs Críticos Protegidos

Os logs de nível `CRITICAL` são protegidos contra remoção automática:
- Erros graves do sistema
- Falhas de segurança
- Problemas de integridade dos dados

## 🎯 Monitoramento Contínuo

### Sinais de que o problema foi resolvido:
- ✅ Logs crescem de forma linear (não exponencial)
- ✅ Sem logs repetitivos de health check
- ✅ Performance da interface de logs melhorada
- ✅ Banco de dados com tamanho controlado

### Métricas para acompanhar:
- Logs por hora/dia
- Tamanho da tabela `logs_auditoria`
- Performance das consultas
- Tempo de resposta da aplicação

## 🚀 Próximos Passos

1. **Deploy das correções**
2. **Executar limpeza inicial** dos logs existentes
3. **Monitorar crescimento** nas próximas 24h
4. **Configurar limpeza automática** via cron/schedule
5. **Ajustar parâmetros** conforme necessário

---

**💡 Resumo:** O loop de logs foi identificado e corrigido. As mudanças reduzirão drasticamente o volume de logs e melhorarão a performance do sistema.
