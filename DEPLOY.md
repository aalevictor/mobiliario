# 🚀 Deploy - Concurso Mobiliário Urbano 2025

## 📋 **Pré-requisitos**

- **Servidor CentOS 7** 
- **MySQL** configurado e rodando
- **Sendmail** instalado (`/usr/sbin/sendmail`)
- **Domínio** redirecionando para porta 3500
- **Acesso sudo/root**

## ⚡ **Deploy Rápido (3 Passos)**

### **1. Configurar Ambiente**
```bash
# Copiar template de configuração
cp .env.production.example .env.production

# Editar configurações
nano .env.production
```

**Configurações obrigatórias:**
```env
# MySQL (adapte para seu servidor)
DATABASE_URL="mysql://usuario:senha@localhost:3306/moburb_production"
DIRECT_URL="mysql://usuario:senha@localhost:3306/moburb_production"

# Segurança
AUTH_SECRET="sua_chave_super_secreta_de_256_bits"

# Email
EMAIL_FROM="naoresponda-mobiliariourbano@spurbanismo.sp.gov.br"
MAIL_ADMIN="admin@spurbanismo.sp.gov.br"

# URL da aplicação
NEXT_PUBLIC_APP_URL="https://concursomoburb.prefeitura.sp.gov.br"
```

### **2. Instalar Dependências (se necessário)**
```bash
# Docker
sudo ./install-docker-centos7.sh

# Sendmail
sudo ./install-sendmail-centos7.sh

# Verificar sendmail
./check-sendmail.sh
```

### **3. Deploy**
```bash
# Deploy completo
./deploy-centos7.sh

# Testar email (opcional)
./test-email.sh seu-email@exemplo.com
```

## 🎯 **O que o Deploy Faz:**

1. **🛑 Para** containers existentes
2. **🗑️ Remove** imagens antigas (evita cache)
3. **🔨 Constrói** nova imagem otimizada para CentOS 7
4. **🗄️ Aplica** migrations do Prisma (`migrate deploy`)
5. **🌱 Executa** seed (cria usuário admin)
6. **🚀 Inicia** aplicação na porta 3500
7. **🧪 Testa** sistema de email
8. **✅ Verifica** health check

## 📊 **Verificações Automáticas:**

- ✅ **MySQL conectado** - via `localhost:3306`
- ✅ **Migrations aplicadas** - banco atualizado
- ✅ **Sendmail funcionando** - emails enviados
- ✅ **Health check** - aplicação respondendo
- ✅ **Logs limpos** - sem erros críticos

## 🔄 **Para Aplicar Alterações:**

### **🚀 Mudanças de Código (3 Opções):**

#### **1. Restart Rápido (sem rebuild):**
```bash
./restart.sh                     # ~30 segundos
```
**Use quando:** Mudanças de configuração, restart simples

#### **2. Rebuild (com cache):**
```bash
./rebuild.sh                     # ~2-3 minutos
```
**Use quando:** Mudanças no código fonte, componentes

#### **3. Rebuild Completo (sem cache):**
```bash
./rebuild-force.sh               # ~5-7 minutos
```
**Use quando:** Mudanças em package.json, Dockerfile

#### **4. Deploy Completo:**
```bash
./deploy-centos7.sh              # ~8-10 minutos
```
**Use quando:** Primeira vez, mudanças no schema/migrations

### **📊 Tabela de Comparação:**

| Comando | Tempo | Use Quando |
|---------|-------|------------|
| `./restart.sh` | ~30s | Configuração, restart simples |
| `./rebuild.sh` | ~2-3min | Mudanças de código |
| `./rebuild-force.sh` | ~5-7min | package.json, Dockerfile |
| `./deploy-centos7.sh` | ~8-10min | Primeira vez, migrations |

### **Mudanças no Schema (Prisma):**
```bash
# 1. Criar migration (desenvolvimento)
npx prisma migrate dev --name nome_da_mudanca

# 2. Commit migration
git add prisma/migrations/
git commit -m "feat: nome_da_mudanca"

# 3. Deploy em produção
./deploy-centos7.sh
```

## 🗄️ **Sistema de Banco de Dados:**

### **Migrations:**
- ✅ **Versionadas** - controle total de mudanças
- ✅ **Automáticas** - aplicadas no deploy
- ✅ **Seguras** - não perdem dados
- ✅ **Reversíveis** - rollback possível

### **Seed:**
- 👤 **Usuário Admin** criado automaticamente
- 📧 **Email:** `vmabreu@prefeitura.sp.gov.br`
- 🔑 **Login:** `d927014`
- 🔐 **Senha:** `mudar123` (deve alterar no primeiro acesso)

### **Comandos Úteis:**
```bash
# Ver status das migrations
docker-compose -f docker-compose.centos7.yml exec moburb-app npx prisma migrate status

# Ver dados do usuário admin
docker-compose -f docker-compose.centos7.yml exec moburb-app npx prisma studio
```

## 📧 **Sistema de Email:**

### **Configuração:**
- 🥇 **Prioridade 1:** Sendmail local (`/usr/sbin/sendmail`)
- 🥈 **Fallback:** SMTP (se configurado no `.env`)

### **Teste:**
```bash
# Teste manual
./test-email.sh seu-email@exemplo.com

# API de teste
curl -X POST http://localhost:3500/api/email-teste \
  -H "Content-Type: application/json" \
  -d '{"templateType": "personalizado", "emailDestino": "test@exemplo.com"}'
```

## 🔍 **Monitoramento:**

### **Logs:**
```bash
# Logs da aplicação
docker-compose -f docker-compose.centos7.yml logs -f moburb-app

# Logs do sistema
sudo tail -f /var/log/maillog
sudo journalctl -u docker -f
```

### **Status:**
```bash
# Containers
docker ps

# Health check
curl http://localhost:3500/api/health

# Aplicação
curl https://concursomoburb.prefeitura.sp.gov.br
```

## 🛡️ **Persistência de Dados:**

### **Volumes Persistentes:**
- 📁 **`./uploads`** - Arquivos dos usuários
- 📄 **`./logs`** - Logs da aplicação
- 🗄️ **MySQL** - Banco de dados (host)

### **Garantias:**
- ✅ **Uploads mantidos** durante redeploys
- ✅ **Logs preservados** para auditoria
- ✅ **Banco seguro** - migrations controladas

## 🔧 **Troubleshooting:**

### **Container não inicia:**
```bash
# Ver logs de erro
docker-compose -f docker-compose.centos7.yml logs moburb-app

# Verificar configuração
docker-compose -f docker-compose.centos7.yml config
```

### **Erro de conexão MySQL:**
```bash
# Testar conexão
mysql -u usuario -p -h localhost nome_do_banco

# Verificar se MySQL está rodando
sudo systemctl status mysqld
```

### **Erro de sendmail:**
```bash
# Verificar instalação
./check-sendmail.sh

# Instalar se necessário
sudo ./install-sendmail-centos7.sh
```

### **Reset completo (emergência):**
```bash
# Para tudo
docker-compose -f docker-compose.centos7.yml down -v

# Remove imagens
docker images | grep mobiliario | awk '{print $3}' | xargs docker rmi -f

# Rebuild total
./deploy-centos7.sh
```

## 📋 **Arquivos Essenciais:**

### **Deploy:**
- `deploy-centos7.sh` - Script principal
- `docker-compose.centos7.yml` - Configuração container
- `Dockerfile.centos7` - Build da imagem
- `.env.production.example` - Template configuração

### **Utilitários:**
- `test-email.sh` - Teste sistema email
- `check-sendmail.sh` - Verificação sendmail
- `install-sendmail-centos7.sh` - Instalação sendmail

### **Configuração:**
- `.env.production` - Configurações (criar baseado no .example)
- `prisma/schema.prisma` - Schema do banco
- `prisma/seed.js` - Dados iniciais

## 🎯 **URLs Importantes:**

- 🌐 **Aplicação:** https://concursomoburb.prefeitura.sp.gov.br
- 🏥 **Health Check:** http://localhost:3500/api/health
- 📧 **Teste Email:** http://localhost:3500/api/email-teste
- 📊 **Admin Logs:** /admin/logs (após login)

## ✅ **Checklist Final:**

- [ ] Configuração `.env.production` criada
- [ ] MySQL conectando corretamente
- [ ] Sendmail instalado e funcionando
- [ ] Deploy executado sem erros
- [ ] Health check respondendo
- [ ] Email de teste enviado
- [ ] Usuário admin pode fazer login
- [ ] Aplicação acessível pelo domínio

**🎉 Sistema pronto para produção!**
