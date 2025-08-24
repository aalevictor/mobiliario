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

## 📋 **Pré-requisitos**

- **Produção**: CentOS 7, MySQL, Docker
- **Desenvolvimento**: Node.js 20+, MySQL

## 🚀 **Deploy em Produção**

### **Deploy Automático (CentOS 7):**
```bash
# 1. Configurar ambiente
cp .env.production.example .env.production
nano .env.production

# 2. Deploy completo
./deploy-centos7.sh

# 3. Testar sistema
./test-email.sh seu-email@exemplo.com
```

### **Desenvolvimento Local:**
```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env.local
cp .env.production.example .env.local
# Editar para MySQL local

# 3. Executar
npx prisma migrate dev
npm run dev
```

## 📚 **Documentação**

- **[DEPLOY.md](DEPLOY.md)** - Guia completo de deploy
- **Aplicação**: https://concursomoburb.prefeitura.sp.gov.br

## 🔧 **Scripts Disponíveis**

### **Deploy:**
- `./deploy-centos7.sh` - Deploy automático para CentOS 7
- `./test-email.sh` - Teste sistema de email
- `./check-sendmail.sh` - Verificar sendmail
- `./install-sendmail-centos7.sh` - Instalar sendmail

### **Desenvolvimento:**
- `npm run dev` - Servidor desenvolvimento
- `npm run build` - Build produção
- `npm run seed` - Popular banco inicial

## 🗄️ **Banco de Dados**

### **Usuário Admin Padrão:**
- **Email**: vmabreu@prefeitura.sp.gov.br
- **Login**: d927014
- **Senha**: mudar123 (alterar no primeiro acesso)

### **Comandos Úteis:**
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

```bash
# Logs aplicação
docker-compose -f docker-compose.centos7.yml logs -f moburb-app

# Health check
curl http://localhost:3500/api/health

# Status containers
docker ps
```

## 🛡️ **Segurança**

- ✅ **Autenticação robusta** com NextAuth.js
- ✅ **Autorização por níveis** de permissão
- ✅ **Validação** de dados com Zod
- ✅ **Sanitização** de uploads
- ✅ **Logs de auditoria** completos
- ✅ **HTTPS** em produção

## 📊 **Estrutura do Projeto**

```
mobiliario/
├── 📁 app/                     # Páginas e API routes
├── 📁 components/              # Componentes React
├── 📁 lib/                     # Bibliotecas e utilitários
├── 📁 services/               # Serviços da aplicação
├── 📁 prisma/                 # Schema e migrations
├── 🐳 docker-compose.centos7.yml
├── 🐳 Dockerfile.centos7
├── 🚀 deploy-centos7.sh
├── 📖 DEPLOY.md
└── ⚙️ package.json
```

---

**🏛️ Desenvolvido para a Prefeitura de São Paulo**
