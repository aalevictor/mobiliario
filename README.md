# MOBURB - Sistema de Gestão de Concursos de Mobiliário Urbano

Sistema web desenvolvido em Next.js para gestão completa de concursos de mobiliário urbano, incluindo cadastros de participantes, avaliações técnicas e administrativa.

## 🏗️ Sobre o Projeto

O MOBURB é uma plataforma desenvolvida para a Secretaria Municipal de Urbanismo e Licenciamento da Prefeitura de São Paulo, que gerencia todo o processo de concursos de mobiliário urbano, desde o cadastro de participantes até a avaliação e aprovação final.

### Principais Funcionalidades

- **Sistema de Autenticação**: Login com diferentes níveis de permissão (DEV, ADMIN, PARTICIPANTE, LICITACAO, JULGADORA)
- **Cadastro de Participantes**: Formulário completo para inscrição no concurso
- **Upload de Documentos**: Sistema para envio de documentos específicos e projetos
- **Avaliação Técnica**: Painel para avaliação de projetos pelos jurados
- **Avaliação Administrativa**: Verificação de documentação pelos licitadores
- **Gestão de Usuários**: Painel administrativo para gerenciar usuários do sistema
- **Sistema de Dúvidas**: Canal de comunicação entre participantes e administradores
- **Notificações por Email**: Sistema automatizado de envio de emails

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Autenticação**: NextAuth.js
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Email**: Nodemailer
- **Formulários**: React Hook Form com Zod
- **Tabelas**: TanStack Table
- **Animações**: Framer Motion
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- npm, yarn, pnpm ou bun

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd mobiliario2
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp example.env .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/moburb2025
DIRECT_URL=postgresql://usuario:senha@localhost:5432/moburb2025
AUTH_SECRET=sua-chave-secreta-aqui

# Configurações de Email SMTP
MAIL_FROM="naoresponda-mobiliariourbano@spurbanismo.sp.gov.br"
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app
MAIL_BCC=equipe-admin@spurbanismo.sp.gov.br

# URL base da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

5. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

## 🏛️ Estrutura do Projeto

```
mobiliario2/
├── app/                          # App Router do Next.js
│   ├── (auth-routes)/           # Rotas autenticadas
│   │   ├── (usuario-valido)/    # Usuários com acesso válido
│   │   │   ├── (admin-routes)/  # Rotas administrativas
│   │   │   └── (participante-routes)/ # Rotas de participantes
│   │   └── (usuario-invalido)/  # Usuários com acesso restrito
│   ├── (open-routes)/           # Rotas públicas
│   └── api/                     # API Routes
├── components/                   # Componentes reutilizáveis
├── lib/                         # Utilitários e configurações
├── prisma/                      # Schema e migrações do banco
├── services/                    # Serviços externos
├── types/                       # Definições de tipos TypeScript
└── uploads/                     # Arquivos enviados pelos usuários
```

## 👥 Níveis de Acesso

- **DEV**: Acesso total ao sistema
- **ADMIN**: Gestão de usuários, cadastros e dúvidas
- **PARTICIPANTE**: Cadastro e envio de documentos
- **LICITACAO**: Avaliação administrativa
- **JULGADORA**: Avaliação técnica dos projetos

## 📧 Sistema de Emails

O sistema utiliza templates de email para notificações automáticas:
- Confirmação de cadastro
- Aprovação/rejeição de documentos
- Respostas a dúvidas
- Notificações administrativas

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push para a branch principal

### Build para Produção

```bash
npm run build
npm start
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é desenvolvido para a Prefeitura de São Paulo e está sob licença interna.

## 📞 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento da Secretaria de Urbanismo e Licenciamento.

---

**Desenvolvido com ❤️ para a Prefeitura de São Paulo**
