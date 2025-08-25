#!/bin/bash

# Script para atualizar dependências sem rebuild completo

set -e

# Funções de log
log_info() {
    echo -e "\e[34m[INFO]\e[0m $1"
}

log_success() {
    echo -e "\e[32m[SUCCESS]\e[0m $1"
}

log_error() {
    echo -e "\e[31m[ERROR]\e[0m $1"
}

echo "📦 ATUALIZAÇÃO DE DEPENDÊNCIAS"
echo "=============================="

# Detecta container rodando
CONTAINER_NAME=$(docker ps | grep moburb | awk '{print $NF}' | head -1)

if [ -z "$CONTAINER_NAME" ]; then
    log_error "❌ Nenhum container moburb encontrado"
    log_info "Execute primeiro: ./deploy.sh"
    exit 1
fi

log_info "Container encontrado: $CONTAINER_NAME"

# Copia package.json atualizado
log_info "1. Copiando package.json atualizado..."
docker cp ./package.json $CONTAINER_NAME:/app/package.json
docker cp ./package-lock.json $CONTAINER_NAME:/app/package-lock.json 2>/dev/null || \
  log_info "package-lock.json não encontrado, será gerado"

# Instala dependências dentro do container
log_info "2. Instalando dependências..."
docker exec $CONTAINER_NAME sh -c "
    npm ci --only=production --no-audit --no-fund &&
    npm ci --no-audit --no-fund
"

if [ $? -ne 0 ]; then
    log_error "❌ Falha na instalação de dependências"
    exit 1
fi

# Regenera Prisma se necessário
if docker exec $CONTAINER_NAME test -f prisma/schema.prisma; then
    log_info "3. Regenerando cliente Prisma..."
    docker exec $CONTAINER_NAME npx prisma generate
fi

# Rebuild da aplicação
log_info "4. Fazendo rebuild da aplicação..."
docker exec $CONTAINER_NAME npm run build

if [ $? -ne 0 ]; then
    log_error "❌ Falha no build da aplicação"
    exit 1
fi

# Restart da aplicação
log_info "5. Reiniciando aplicação..."
docker exec $CONTAINER_NAME sh -c "pkill -f 'npm start' || pkill -f 'node' || true"
docker exec -d $CONTAINER_NAME npm start

# Aguarda e verifica
log_info "6. Verificando aplicação..."
sleep 15

if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
    log_success "✅ Dependências atualizadas com sucesso!"
else
    log_error "❌ Aplicação não está respondendo após atualização"
    log_info "Verificando logs..."
    docker logs $CONTAINER_NAME --tail=20
    exit 1
fi

log_success "🎉 DEPENDÊNCIAS ATUALIZADAS!"
echo ""
echo "📊 Resumo:"
echo "   • Dependências: Instaladas e atualizadas"
echo "   • Prisma: Regenerado"
echo "   • Build: Realizado"
echo "   • Tempo: ~2-3 minutos (sem rebuild de imagem)"
