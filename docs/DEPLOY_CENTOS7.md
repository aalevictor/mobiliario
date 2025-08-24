# Deploy CentOS 7 - Concurso Mobiliário Urbano

Este documento descreve como fazer o deploy da aplicação do Concurso de Mobiliário Urbano em um servidor CentOS 7 usando Docker.

## 📋 Pré-requisitos

- Servidor CentOS 7
- MySQL configurado e rodando na máquina
- Acesso sudo/root
- Sendmail configurado no sistema (`/usr/sbin/sendmail`)
- Domínio `concursomoburb.prefeitura.sp.gov.br` redirecionando para a porta 3500

## 🚀 Instalação Rápida

### 1. Instalar Docker (se não estiver instalado)

```bash
# Torna o script executável
chmod +x install-docker-centos7.sh

# Execute como root ou com sudo
sudo ./install-docker-centos7.sh
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copia o arquivo de exemplo
cp env.production.example .env.production

# Edite o arquivo com suas configurações
nano .env.production
```

**Configurações obrigatórias no `.env.production`:**

```bash
# Banco de dados MySQL (substitua pelos dados do seu MySQL)
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
DIRECT_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"

# Chave secreta (gere uma chave segura)
AUTH_SECRET="sua_chave_super_secreta_de_256_bits_aqui"

# Configurações de email
MAIL_FROM="naoresponda-mobiliariourbano@spurbanismo.sp.gov.br"
MAIL_BCC="equipe-admin@spurbanismo.sp.gov.br"
MAIL_ADMIN="dev-admin@spurbanismo.sp.gov.br"
```

### 3. Executar Deploy

```bash
# Torna o script executável
chmod +x deploy.sh

# Execute o deploy
./deploy.sh
```

**Nota:** O deploy automaticamente executa:
- Migrations do banco (`prisma migrate deploy`)
- Seed do banco (`npm run seed`) - cria usuário administrador DEV

### 4. Gerenciar a Aplicação

```bash
# Torna o script de gerenciamento executável
chmod +x manage.sh

# Ver comandos disponíveis
./manage.sh help
```

## 📁 Estrutura de Arquivos

```
mobiliario/
├── Dockerfile                 # Configuração do container
├── docker-compose.yml         # Orquestração dos serviços
├── .env.production            # Variáveis de ambiente (você deve criar)
├── env.production.example     # Exemplo de configuração
├── deploy.sh                  # Script de deploy automático
├── install-docker-centos7.sh  # Script de instalação do Docker
├── manage.sh                  # Script de gerenciamento
├── uploads/                   # Arquivos enviados (volume persistente)
├── logs/                      # Logs da aplicação (volume persistente)
└── app/api/health/            # Endpoint de health check
```

## 🔧 Configuração Detalhada

### Banco de Dados

A aplicação espera um banco MySQL já configurado. Certifique-se de:

1. Criar o banco de dados:
```sql
CREATE DATABASE moburb_concurso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Criar um usuário específico:
```sql
CREATE USER 'moburb_user'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON moburb_concurso.* TO 'moburb_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Configurar no `.env.production`:
```bash
DATABASE_URL="mysql://moburb_user:senha_segura@localhost:3306/moburb_concurso"
```

### Sendmail

A aplicação usará o sendmail do sistema. Certifique-se de que:

1. O sendmail está instalado e configurado
2. O caminho `/usr/sbin/sendmail` existe
3. A configuração ENVIRONMENT="production" está no `.env.production`

### Proxy Reverso

Como mencionado, o servidor já tem configuração de proxy reverso redirecionando para a porta 3500, então a aplicação será automaticamente acessível via `https://concursomoburb.prefeitura.sp.gov.br`.

## 📊 Monitoramento

### Comandos Úteis

```bash
# Ver status da aplicação
./manage.sh status

# Verificar saúde da aplicação
./manage.sh health

# Ver logs em tempo real
./manage.sh logs-follow

# Estatísticas detalhadas
./manage.sh stats

# Reiniciar aplicação
./manage.sh restart
```

### Health Check

A aplicação inclui um endpoint de health check em `/api/health` que verifica:
- Conectividade com o banco de dados
- Status geral da aplicação

### Logs

Os logs são salvos em:
- Container: `/app/logs/`
- Host: `./logs/`
- Docker: `docker-compose logs`

## 🔒 Segurança

### Variáveis de Ambiente Sensíveis

Mantenha o arquivo `.env.production` seguro:

```bash
# Defina permissões restritivas
chmod 600 .env.production

# Verifique que não está no git
echo ".env.production" >> .gitignore
```

### Container Security

- O container roda com usuário não-root (`nextjs`)
- Usa `network_mode: host` para acessar MySQL e sendmail locais
- Volumes específicos para dados persistentes

## 🛠️ Manutenção

### Atualizações

```bash
# Atualizar aplicação (rebuild + restart)
./manage.sh update
```

### Backup

```bash
# Backup do banco de dados
./manage.sh backup-db
```

### Limpeza

```bash
# Limpar containers e imagens antigas
./manage.sh cleanup
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Container não inicia**
   ```bash
   # Verificar logs
   ./manage.sh logs
   
   # Verificar configurações
   docker-compose config
   ```

2. **Erro de conexão com banco**
   ```bash
   # Testar conexão MySQL
   mysql -u usuario -p -h localhost nome_do_banco
   
   # Verificar variáveis de ambiente
   grep DATABASE_URL .env.production
   ```

3. **Problemas com sendmail**
   ```bash
   # Testar sendmail
   echo "Teste" | /usr/sbin/sendmail teste@example.com
   
   # Verificar se o volume está montado
   docker exec moburb-concurso ls -la /usr/sbin/sendmail
   ```

4. **Health check falhando**
   ```bash
   # Testar manualmente
   curl http://localhost:3500/api/health
   
   # Verificar se a porta está livre
   netstat -tlnp | grep 3500
   ```

### Logs Detalhados

```bash
# Logs do sistema Docker
sudo journalctl -u docker.service

# Logs específicos do container
docker logs moburb-concurso

# Logs da aplicação
./manage.sh logs
```

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `./manage.sh logs`
2. Teste o health check: `./manage.sh health`
3. Verifique o status: `./manage.sh status`
4. Consulte a documentação do CentOS 7 e Docker

## ⚡ Comandos de Emergência

```bash
# Parar tudo
./manage.sh stop

# Reiniciar forçado
docker kill moburb-concurso
./manage.sh start

# Rebuild completo
docker-compose down
docker rmi mobiliario_moburb-app:latest
./deploy.sh
```
