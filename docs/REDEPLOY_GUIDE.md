# 🔄 Guia de Re-deploy - Atualizações de Código

Este guia mostra como refazer o deploy quando houver alterações no código da aplicação.

## 📋 Índice

- [Ambiente Local (Windows)](#-ambiente-local-windows)
- [Ambiente de Produção (CentOS 7)](#-ambiente-de-produção-centos-7)
- [Por Tipo de Mudança](#-guia-por-tipo-de-mudança)
- [Verificações Pós-Deploy](#-verificações-pós-deploy)
- [Troubleshooting](#-troubleshooting)

---

## 🖥️ Ambiente Local (Windows)

### Opção 1: Update Simples (Recomendado)
Para mudanças menores de código:

```powershell
# Atualiza a aplicação
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Update
```

### Opção 2: Restart Rápido
Para mudanças muito pequenas:

```powershell
# Apenas reinicia o container
docker-compose -f docker-compose.local.yml restart moburb-app
```

### Opção 3: Rebuild Completo
Para mudanças maiores (dependências, Docker, etc.):

```powershell
# Para tudo, limpa e reconstrói
PowerShell -ExecutionPolicy Bypass -File "deploy-local.ps1" -Clean -Rebuild
```

### Opção 4: Manual Passo a Passo

```powershell
# 1. Para a aplicação
docker-compose -f docker-compose.local.yml down

# 2. Rebuild apenas da aplicação
docker-compose -f docker-compose.local.yml build moburb-app

# 3. Inicia tudo novamente
docker-compose -f docker-compose.local.yml up -d

# 4. Verifica se está funcionando
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Health
```

---

## 🚀 Ambiente de Produção (CentOS 7)

### Opção 1: Script de Deploy (Recomendado)
Para qualquer tipo de mudança:

```bash
# Re-deploy completo
./deploy.sh
```

### Opção 2: Update via Script de Gerenciamento
Para mudanças de código apenas:

```bash
# Update da aplicação
./manage.sh update
```

### Opção 3: Manual Passo a Passo

```bash
# 1. Para a aplicação
docker-compose down

# 2. Remove imagem antiga
docker rmi mobiliario_moburb-app:latest || true

# 3. Rebuild da imagem
docker-compose build --no-cache

# 4. Executa migrations (se houver)
docker-compose run --rm moburb-app npx prisma migrate deploy

# 5. Executa seed (se necessário)
docker-compose run --rm moburb-app npm run seed

# 6. Inicia novamente
docker-compose up -d

# 7. Verifica se está funcionando
./manage.sh health
```

---

## 🎯 Guia por Tipo de Mudança

### 📝 Mudanças de Código (HTML, CSS, JS, TypeScript)

**Local:**
```powershell
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Update
```

**Produção:**
```bash
./manage.sh update
```

### 🗄️ Mudanças no Banco de Dados (Schema Prisma)

**Local:**
```powershell
# Deploy completo para aplicar migrations
PowerShell -ExecutionPolicy Bypass -File "deploy-local.ps1" -Clean -Rebuild
```

**Produção:**
```bash
# Deploy completo para aplicar migrations
./deploy.sh
```

### 📦 Mudanças em Dependências (package.json)

**Local:**
```powershell
# Rebuild para instalar novas dependências
PowerShell -ExecutionPolicy Bypass -File "deploy-local.ps1" -Rebuild
```

**Produção:**
```bash
# Deploy completo para instalar dependências
./deploy.sh
```

### ⚙️ Mudanças de Configuração (Docker, .env)

**Local:**
```powershell
# Deploy completo
PowerShell -ExecutionPolicy Bypass -File "deploy-local.ps1" -Clean -Rebuild
```

**Produção:**
```bash
# Deploy completo
./deploy.sh
```

### 🌱 Mudanças no Seed (prisma/seed.js)

**Local:**
```powershell
# Apenas executa o seed novamente
docker-compose -f docker-compose.local.yml exec moburb-app npm run seed
```

**Produção:**
```bash
# Apenas executa o seed novamente
docker-compose exec moburb-app npm run seed
```

---

## 🔍 Verificações Pós-Deploy

Após qualquer re-deploy, execute estas verificações:

### 1. Status dos Containers

**Local:**
```powershell
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Status
```

**Produção:**
```bash
./manage.sh status
```

### 2. Health Check

**Local:**
```powershell
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Health
```

**Produção:**
```bash
./manage.sh health
```

### 3. Verificar Logs

**Local:**
```powershell
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Logs
```

**Produção:**
```bash
./manage.sh logs
```

### 4. Teste Manual

**Local:**
- Acesse: http://localhost:3500
- Health: http://localhost:3500/api/health

**Produção:**
- Acesse: https://concursomoburb.prefeitura.sp.gov.br
- Health: https://concursomoburb.prefeitura.sp.gov.br/api/health

---

## 🛡️ Boas Práticas

### 1. Backup Antes de Deploy (Produção)

```bash
# Faça backup do banco antes de mudanças importantes
./manage.sh backup-db

# Backup dos uploads (opcional, mas recomendado)
tar -czf uploads-backup-$(date +%Y%m%d_%H%M%S).tar.gz uploads/
```

### 2. Teste Local Primeiro

```powershell
# 1. Teste mudanças localmente
PowerShell -ExecutionPolicy Bypass -File "deploy-local.ps1"

# 2. Só depois faça deploy em produção
# (no servidor CentOS 7)
./deploy.sh
```

### 3. Monitore Logs Durante Deploy

**Local:**
```powershell
# Em uma janela separada, monitore logs
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -LogsFollow
```

**Produção:**
```bash
# Em uma sessão separada, monitore logs
./manage.sh logs-follow
```

---

## 🚨 Troubleshooting

### Problema: Container não inicia após update

**Solução:**
```bash
# Verifique logs de erro
./manage.sh logs

# Se necessário, rebuild completo
./deploy.sh  # Produção
./deploy-local.ps1 -Clean -Rebuild  # Local
```

### Problema: Banco de dados com erro

**Solução:**
```bash
# Execute migrations manualmente
docker-compose exec moburb-app npx prisma migrate deploy

# Verifique conexão
docker-compose exec moburb-app npx prisma db pull
```

### Problema: Aplicação não responde

**Solução:**
```bash
# 1. Verifique se container está rodando
./manage.sh status

# 2. Teste health check
./manage.sh health

# 3. Se necessário, restart
./manage.sh restart
```

### Problema: Mudanças não aparecem

**Solução:**
```bash
# 1. Limpe cache do Docker
docker system prune -f

# 2. Rebuild sem cache
docker-compose build --no-cache

# 3. Deploy completo
./deploy.sh
```

---

## ⚡ Comandos Rápidos de Referência

### Comandos Mais Usados

**Desenvolvimento Local:**
```powershell
# Update simples (mais comum)
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Update

# Deploy completo
PowerShell -ExecutionPolicy Bypass -File "deploy-local.ps1"

# Ver logs
PowerShell -ExecutionPolicy Bypass -File "manage-local.ps1" -Logs
```

**Produção:**
```bash
# Update simples (mais comum)
./manage.sh update

# Deploy completo
./deploy.sh

# Ver logs
./manage.sh logs
```

### Em Caso de Emergência

```bash
# Para tudo
./manage.sh stop

# Inicia tudo
./manage.sh start

# Restart forçado
docker kill moburb-concurso
./manage.sh start
```

---

## 💾 Persistência de Dados

### ✅ **GARANTIDO: Uploads são mantidos**

Os arquivos de upload **NÃO são perdidos** durante re-deploy:

```yaml
# Configuração que garante persistência
volumes:
  - ./uploads:/app/uploads  # Pasta do host → Container
  - ./logs:/app/logs        # Logs também persistem
```

**Como funciona:**
1. ❌ Container é removido
2. ✅ Pasta `./uploads/` permanece no host
3. ✅ Novo container mapeia a mesma pasta
4. ✅ Arquivos continuam acessíveis

**Verificação rápida:**
```bash
# Antes do deploy
ls -la uploads/

# Após o deploy
ls -la uploads/  # Mesmos arquivos!
```

📖 **Para mais detalhes, veja:** `PERSISTENCIA_DADOS.md`

---

## 📞 Checklist Rápido

- [ ] Backup feito (se produção)
- [ ] Testado localmente
- [ ] Deploy executado
- [ ] Containers rodando (`./manage.sh status`)
- [ ] Health check OK (`./manage.sh health`)
- [ ] Teste manual no browser
- [ ] Logs sem erros (`./manage.sh logs`)
- [ ] Uploads preservados (`ls -la uploads/`)

---

**💡 Dica:** Na dúvida, use sempre o deploy completo:
- Local: `./deploy-local.ps1`
- Produção: `./deploy.sh`
