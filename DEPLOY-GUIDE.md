# 🚀 Guia de Deploy - MOBURB

## 📋 **Resumo Rápido**

### **🏭 Produção (CentOS 7):**
```bash
# Deploy completo (primeira vez)
./deploy.sh

# Atualizar apenas código
./update-code.sh

# Atualizar dependências
./update-deps.sh

# Restart rápido
./quick-restart.sh
```

### **💻 Desenvolvimento Local:**
```bash
# Desenvolvimento com hot-reload
docker-compose -f docker-compose.dev.yml up

# Build local sem Docker
npm run dev
```

---

## 🎯 **Escolha Seu Cenário**

### **📝 Mudei código (componentes, páginas, APIs):**
```bash
./update-code.sh        # ~30 segundos
```

### **📦 Mudei package.json (dependências):**
```bash
./update-deps.sh        # ~2-3 minutos
```

### **🔄 Só quero reiniciar:**
```bash
./quick-restart.sh      # ~15 segundos
```

### **🗄️ Mudei schema do banco:**
```bash
./deploy.sh             # ~5-10 minutos (deploy completo)
```

---

## 📊 **Comparação de Performance**

| Ação | Tempo | Recria Container | Perde Dados | Use Quando |
|------|-------|------------------|-------------|------------|
| `update-code.sh` | 30s | ❌ | ❌ | Código TypeScript/React |
| `update-deps.sh` | 2-3min | ❌ | ❌ | package.json |
| `quick-restart.sh` | 15s | ❌ | ❌ | Problemas temporários |
| `deploy.sh` | 5-10min | ✅ | ❌ | Migrations, Dockerfile |

---

## 🔧 **Estrutura de Arquivos**

### **📁 Arquivos Principais:**
```
├── Dockerfile              # Produção otimizada
├── Dockerfile.dev          # Desenvolvimento com hot-reload
├── docker-compose.yml      # Produção
├── docker-compose.dev.yml  # Desenvolvimento
├── deploy.sh              # Deploy completo
├── update-code.sh         # Atualização rápida de código
├── update-deps.sh         # Atualização de dependências
└── quick-restart.sh       # Restart sem rebuild
```

### **⚙️ Configurações:**
```
├── .env.production        # Produção (CentOS 7)
├── .env.local            # Desenvolvimento local
├── prisma/schema.prisma  # Schema do banco
└── package.json          # Dependências
```

---

## 🏗️ **Desenvolvimento**

### **🔥 Hot-reload (Recomendado):**
```bash
# Inicia com hot-reload
docker-compose -f docker-compose.dev.yml up

# Ou sem Docker
npm run dev
```

### **💡 Funcionalidades:**
- ✅ **Hot-reload automático** para mudanças em código
- ✅ **Volumes persistentes** para uploads/logs
- ✅ **MySQL local** containerizado
- ✅ **Debug** com sourcemaps

---

## 🏭 **Produção**

### **🚀 Deploy Inicial:**
```bash
# 1. Configurar ambiente
cp .env.production.example .env.production
nano .env.production

# 2. Deploy
./deploy.sh

# 3. Verificar
curl http://localhost:3500/api/health
```

### **🔄 Atualizações:**
```bash
# Código mudou
git pull
./update-code.sh

# Dependências mudaram
./update-deps.sh

# Schema mudou
./deploy.sh
```

---

## 📧 **Configuração Email**

### **🏭 Produção (Sendmail):**
```env
# .env.production
ENVIRONMENT=production
# Sendmail é detectado automaticamente
```

### **💻 Desenvolvimento (SMTP):**
```env
# .env.local
ENVIRONMENT=local
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app
```

---

## 🗄️ **Banco de Dados**

### **🏭 Produção:**
```env
DATABASE_URL="mysql://user:password@localhost:3306/moburb_production"
```

### **💻 Desenvolvimento:**
```env
DATABASE_URL="mysql://moburb_user:senha123@mysql-local:3306/moburb_local"
```

### **📝 Comandos Úteis:**
```bash
# Ver status das migrations
npx prisma migrate status

# Reset banco (CUIDADO!)
npx prisma migrate reset

# Studio (interface visual)
npx prisma studio
```

---

## 🔍 **Troubleshooting**

### **🐛 Aplicação não responde:**
```bash
# 1. Verificar container
docker ps

# 2. Ver logs
docker logs moburb-concurso --tail=50

# 3. Restart rápido
./quick-restart.sh
```

### **📦 Problema com dependências:**
```bash
# 1. Atualizar dependências
./update-deps.sh

# 2. Se falhar, rebuild completo
./deploy.sh
```

### **🔗 Problema com banco:**
```bash
# 1. Verificar conexão
docker exec moburb-concurso npx prisma migrate status

# 2. Se necessário, deploy completo
./deploy.sh
```

---

## 📊 **Monitoramento**

### **🔍 Health Check:**
```bash
curl http://localhost:3500/api/health
```

### **📋 Logs:**
```bash
# Logs em tempo real
docker logs moburb-concurso -f

# Últimos 50 logs
docker logs moburb-concurso --tail=50

# Logs de sistema
journalctl -u docker -f
```

### **💾 Espaço em Disco:**
```bash
# Limpeza de imagens antigas
docker system prune -f

# Verificar espaço
df -h
du -sh /var/lib/docker
```

---

## 🛡️ **Backup**

### **📁 Dados Importantes:**
- `./uploads/` - Arquivos dos usuários
- `./logs/` - Logs da aplicação
- Banco MySQL (via dump)

### **💾 Comando de Backup:**
```bash
# Backup do banco
mysqldump moburb_production > backup_$(date +%Y%m%d).sql

# Backup dos uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

---

## 🎯 **Resumo dos Scripts**

### **🚀 Deploy e Atualizações:**
- `./deploy.sh` - Deploy completo (primeira vez, migrations)
- `./update-code.sh` - Atualização rápida de código (~30s)
- `./update-deps.sh` - Atualização de dependências (~2-3min)
- `./quick-restart.sh` - Restart rápido (~15s)

### **💻 Desenvolvimento:**
- `docker-compose -f docker-compose.dev.yml up` - Hot-reload
- `npm run dev` - Desenvolvimento local sem Docker

### **🔍 Monitoramento:**
- `docker ps` - Status dos containers
- `docker logs moburb-concurso -f` - Logs em tempo real
- `curl http://localhost:3500/api/health` - Health check

**🎉 Sistema otimizado para atualizações rápidas sem rebuilds desnecessários!**
