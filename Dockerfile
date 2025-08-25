# Dockerfile alternativo para CentOS 7
# Usa imagem base diferente para evitar problemas de compatibilidade

# Tenta uma imagem base mais compatível com CentOS 7
FROM node:20-slim

# Instala dependências necessárias
RUN apt-get update && apt-get install -y \
    curl \
    openssl \
    ca-certificates \
    tzdata \
    && rm -rf /var/lib/apt/lists/* \
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
RUN groupadd -g 1001 nodejs
RUN useradd -r -u 1001 -g nodejs nextjs

# Cria diretórios necessários
RUN mkdir -p /app/uploads /app/logs
RUN chown -R nextjs:nodejs /app/uploads /app/logs /app/.next || true

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

# Explicitamente remove qualquer entrypoint herdado
ENTRYPOINT []
CMD ["npm", "start"]
