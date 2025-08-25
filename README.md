# 🏛️ MOBURB - Concurso Mobiliário Urbano 2025

Sistema web para gestão completa de concursos de mobiliário urbano da Secretaria Municipal de Urbanismo e Licenciamento da Prefeitura de São Paulo.

## 🎯 **Funcionalidades Principais**

- 🔐 **Autenticação** - Login com diferentes níveis de permissão
- 👥 **Cadastro de Participantes** - Formulário completo para inscrição
- 📄 **Upload de Documentos** - Sistema para envio de projetos
- ⚖️ **Avaliação Técnica** - Painel para jurados
- 📋 **Avaliação Administrativa** - Verificação de documentação
- 👨‍💼 **Gestão de Usuários** - Painel administrativo
- ❓ **Sistema de Dúvidas** - Canal de comunicação
- 📧 **Notificações Email** - Sistema automatizado

## 🚀 **Tecnologias**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Autenticação**: NextAuth.js com LDAP
- **Banco de Dados**: MySQL com Prisma ORM
- **Email**: Nodemailer (Sendmail/SMTP)
- **Deploy**: Docker + CentOS 7
- **Logs**: Sistema completo de auditoria

## ⚡ **Deploy Rápido**

### **🏭 Produção (CentOS 7):**
```bash
# Deploy completo (primeira vez)
./deploy.sh

# Atualizar apenas código (~30s)
./update-code.sh

# Atualizar dependências (~2-3min)
./update-deps.sh

# Restart rápido (~15s)
./quick-restart.sh
```

### **💻 Desenvolvimento:**
```bash
# Hot-reload automático
docker-compose -f docker-compose.dev.yml up

# Ou desenvolvimento local
npm run dev
```

## 📊 **Comparação de Scripts**

| Script | Tempo | Rebuild | Use Quando |
|--------|-------|---------|------------|
| `./update-code.sh` | ~30s | ❌ | Código TypeScript/React |
| `./update-deps.sh` | ~2-3min | ❌ | package.json |
| `./quick-restart.sh` | ~15s | ❌ | Problemas temporários |
| `./deploy.sh` | ~5-10min | ✅ | Migrations, Dockerfile |

## 🔧 **Scripts Disponíveis**

### **🚀 Atualizações Rápidas:**
- `./update-code.sh` - Atualiza código sem rebuild
- `./update-deps.sh` - Atualiza dependências no container
- `./quick-restart.sh` - Restart da aplicação
- `./deploy.sh` - Deploy completo

### **💻 Desenvolvimento:**
- `docker-compose -f docker-compose.dev.yml up` - Hot-reload
- `npm run dev` - Desenvolvimento local
- `npm run build` - Build produção
- `npm run seed` - Popular banco inicial

## 🗄️ **Banco de Dados**

### **👤 Usuário Admin Padrão:**
- **Email**: vmabreu@prefeitura.sp.gov.br
- **Login**: d927014
- **Senha**: mudar123 (alterar no primeiro acesso)

### **📝 Comandos Úteis:**
```bash
# Ver migrations
npx prisma migrate status

# Studio (interface visual)
npx prisma studio

# Reset banco (desenvolvimento)
npx prisma migrate reset
```

## 📧 **Sistema de Email**

- **Prioridade 1**: Sendmail local (`/usr/sbin/sendmail`)
- **Fallback**: SMTP (se configurado)
- **Templates**: Sistema completo de templates HTML

## 🔍 **Monitoramento**

### **🏥 Health Check:**
```bash
curl http://localhost:3500/api/health
```

### **📋 Logs:**
```bash
# Logs em tempo real
docker logs moburb-concurso -f

# Health check
curl http://localhost:3500/api/health

# Status containers
docker ps
```

## 📚 **Documentação**

- **[DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)** - Guia completo de deploy
- **Aplicação**: https://concursomoburb.prefeitura.sp.gov.br

## 🎯 **Estrutura Otimizada**

### **📁 Arquivos Principais:**
```
├── Dockerfile              # Produção
├── Dockerfile.dev          # Desenvolvimento + hot-reload
├── docker-compose.yml      # Produção
├── docker-compose.dev.yml  # Desenvolvimento
├── deploy.sh              # Deploy completo
├── update-code.sh         # Atualização rápida
├── update-deps.sh         # Atualização dependências
└── quick-restart.sh       # Restart rápido
```

**🎉 Sistema otimizado para atualizações rápidas sem rebuilds desnecessários!**

---

*Para guia detalhado, consulte [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)*