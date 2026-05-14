FROM node:20-slim AS base

# ---- Stage 1: instala dependências ----
FROM base AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --no-audit --no-fund

# ---- Stage 2: build ----
FROM base AS builder
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Stage 3: runner (imagem final mínima) ----
FROM base AS runner
RUN apt-get update && apt-get install -y curl openssl ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3500
ENV HOSTNAME="0.0.0.0"
ENV ENVIRONMENT=production

RUN groupadd -g 1001 nodejs \
    && useradd -r -u 1001 -g nodejs nextjs \
    && mkdir -p /app/uploads /app/logs

# Bundle standalone do Next.js (inclui node_modules mínimos para rodar)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma CLI + engines para rodar db push na inicialização
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

RUN chown -R nextjs:nodejs /app/uploads /app/logs

USER nextjs

EXPOSE 3500

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3500/api/health || exit 1

ENTRYPOINT []
CMD ["node", "server.js"]
