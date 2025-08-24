# 🗄️ Prisma Migrations vs DB Push - Deploy de Produção

## ⚠️ **Correção Importante Aplicada:**

### **❌ Antes (Incorreto para Produção):**
```bash
npx prisma db push
```

### **✅ Agora (Correto para Produção):**
```bash
npx prisma migrate deploy
```

## 🔍 **Por que a Mudança é Importante:**

### **`prisma db push` (Desenvolvimento):**
- ❌ **Não usa migrations** - aplica schema diretamente
- ❌ **Não é rastreado** - sem histórico de mudanças
- ❌ **Pode perder dados** - em mudanças estruturais
- ❌ **Não é reversível** - sem rollback
- ⚠️ **Apenas para desenvolvimento** rápido

### **`prisma migrate deploy` (Produção):**
- ✅ **Usa migrations** - arquivos versionados
- ✅ **Rastreado** - histórico completo de mudanças
- ✅ **Seguro** - migrations testadas
- ✅ **Reversível** - possibilidade de rollback
- ✅ **Produção-ready** - processo controlado

## 📋 **Sequência de Deploy Atualizada:**

### **Nova Sequência no Container:**
```bash
1. sleep 15                    # Aguarda MySQL estar pronto
2. npx prisma migrate deploy   # ✅ Aplica migrations (NOVO)
3. npx prisma generate         # Gera cliente Prisma
4. npm run seed                # Executa seed (se necessário)
5. npm start                   # Inicia aplicação
```

### **Benefícios da Mudança:**
- ✅ **Controle de versão** das mudanças no banco
- ✅ **Histórico** de todas as migrations aplicadas
- ✅ **Segurança** - sem alterações não controladas
- ✅ **Consistência** entre ambientes
- ✅ **Rollback** possível se necessário

## 🎯 **Como Funciona na Prática:**

### **Desenvolvimento Local:**
```bash
# 1. Criar mudança no schema
# edita prisma/schema.prisma

# 2. Gerar migration
npx prisma migrate dev --name adicionar_nova_tabela

# 3. Commit da migration
git add prisma/migrations/
git commit -m "feat: adicionar nova tabela"
```

### **Deploy em Produção:**
```bash
# 1. Pull do código com novas migrations
git pull origin main

# 2. Deploy (automaticamente executa)
./deploy-centos7.sh

# Internamente executa:
# npx prisma migrate deploy  ← Aplica apenas migrations pendentes
```

## 📊 **Status das Migrations:**

### **Verificar Migrations Aplicadas:**
```bash
# No container
docker-compose -f docker-compose.centos7.yml exec moburb-app npx prisma migrate status

# Localmente
npx prisma migrate status
```

### **Ver Histórico:**
```bash
# Listar migrations aplicadas
ls -la prisma/migrations/

# Ver SQL de uma migration específica
cat prisma/migrations/20240824024427_inicial/migration.sql
```

## 🔧 **Troubleshooting:**

### **Se Migration Falhar:**
```bash
# Ver erro específico
docker-compose -f docker-compose.centos7.yml logs moburb-app | grep -i migrate

# Resolver migration manual (cuidado!)
docker-compose -f docker-compose.centos7.yml exec moburb-app npx prisma migrate resolve --applied MIGRATION_NAME
```

### **Reset Completo (Emergência):**
```bash
# ⚠️ CUIDADO: Perde todos os dados
docker-compose -f docker-compose.centos7.yml exec moburb-app npx prisma migrate reset
```

## 📋 **Arquivos Atualizados:**

### **1. `docker-compose.centos7.yml`:**
```yaml
command: ["sh", "-c", "sleep 15 && npx prisma migrate deploy && npx prisma generate && npm run seed || echo 'Seed executado' && npm start"]
```

### **2. `test-email.sh`:**
- ✅ Agora usa API de teste simplificada
- ✅ Melhor detecção de erros
- ✅ Logs mais informativos

### **3. `deploy-centos7.sh`:**
- ✅ Teste de email automático após deploy
- ✅ Verificação completa do sistema

## 🎯 **Próximos Passos:**

### **Para Aplicar a Correção:**
```bash
# 1. Deploy com a correção
./deploy-centos7.sh

# 2. Verificar se migrations foram aplicadas
docker-compose -f docker-compose.centos7.yml exec moburb-app npx prisma migrate status

# 3. Testar sistema completo
./test-email.sh seu-email@exemplo.com
```

## ✅ **Resultado:**

### **Antes:**
- ⚠️ Schema aplicado diretamente (db push)
- ❌ Sem controle de versão
- ❌ Risco de inconsistências

### **Depois:**
- ✅ Migrations versionadas e controladas
- ✅ Histórico completo de mudanças
- ✅ Processo seguro para produção
- ✅ Possibilidade de rollback
- ✅ Teste de email integrado ao deploy

**🎉 Agora o deploy está seguindo as melhores práticas do Prisma para produção!**
