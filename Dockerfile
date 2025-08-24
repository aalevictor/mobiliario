# Dockerfile para Next.js no CentOS 7
# Usa uma imagem base Node.js 20 compatible com CentOS 7
FROM node:20-alpine

# Instala curl para health check e outras dependências
RUN apk add --no-cache \
    curl \
    openssl \
    ca-certificates \
    tzdata \
    && update-ca-certificates

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências primeiro (para cache de layer)
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências
RUN npm ci --only=production --no-audit --no-fund

# Instala dev dependencies temporariamente para build
RUN npm ci --no-audit --no-fund

# Copia o código fonte
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Faz o build da aplicação
RUN npm run build

# Remove dev dependencies para reduzir tamanho da imagem
RUN npm prune --production

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cria diretórios necessários
RUN mkdir -p /app/uploads /app/logs
RUN chown -R nextjs:nodejs /app/uploads /app/logs /app/.next || true

# Cria entrypoint script diretamente no container (mais confiável para CentOS 7)
RUN printf '#!/bin/sh\n\nset -e\n\necho "🔄 Aguardando MySQL estar disponível..."\n\n# Função para aguardar o MySQL\nwait_for_mysql() {\n    until npx prisma db push --accept-data-loss 2>/dev/null; do\n        echo "⏳ MySQL ainda não está pronto. Aguardando..."\n        sleep 2\n    done\n    echo "✅ MySQL está pronto!"\n}\n\n# Aguarda o MySQL\nwait_for_mysql\n\n# Executa as migrations\necho "🔄 Executando migrations..."\nnpx prisma db push\n\n# Gera o cliente Prisma (caso tenha mudanças)\necho "🔄 Gerando cliente Prisma..."\nnpx prisma generate\n\n# Executa seed do banco de dados (garante dados iniciais)\necho "🔄 Executando seed do banco de dados..."\nnpm run seed || echo "⚠️ Seed falhou ou já executado"\n\necho "🚀 Iniciando aplicação..."\n\n# Executa o comando passado como argumento\nexec "$@"\n' > /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Muda para usuário não-root
USER nextjs

# Expõe a porta 3500 (conforme requisito)
EXPOSE 3500

# Define variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3500
ENV HOSTNAME="0.0.0.0"
ENV ENVIRONMENT=production

# Healthcheck para monitoramento
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3500/api/health || exit 1

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["npm", "start"]
