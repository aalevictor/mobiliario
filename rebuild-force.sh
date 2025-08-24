#!/bin/bash

# Script para rebuild completo com cache limpo
# Use quando houver mudanças em dependências ou Dockerfile

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

log_warning() {
    echo -e "\e[33m[WARNING]\e[0m $1"
}

DOCKER_COMPOSE="docker-compose -f docker-compose.centos7.yml"

echo "🔨 REBUILD FORCE - Cache Limpo"
echo "=============================="

# Verificar se o container existe
if ! docker ps -a | grep -q "moburb-concurso-centos7"; then
    log_error "Container não existe. Execute primeiro: ./deploy-centos7.sh"
    exit 1
fi

# Para e remove container
log_info "Parando e removendo container..."
$DOCKER_COMPOSE down

# Remove imagem antiga
log_info "Removendo imagem antiga..."
docker images | grep mobiliario | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || log_warning "Nenhuma imagem anterior encontrada"

# Rebuild com cache limpo
log_info "Fazendo rebuild com cache limpo..."
$DOCKER_COMPOSE build --no-cache --pull moburb-app

# Inicia container
log_info "Iniciando container..."
$DOCKER_COMPOSE up -d moburb-app

# Aguarda aplicação ficar pronta (mais tempo para rebuild completo)
log_info "Aguardando aplicação inicializar (rebuild completo)..."
sleep 20

# Verifica se está funcionando
log_info "Verificando se aplicação está respondendo..."
for i in {1..30}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Aplicação funcionando após rebuild completo!"
        break
    else
        if [ $i -eq 30 ]; then
            log_error "❌ Aplicação não respondeu após rebuild"
            log_info "Verificando logs..."
            $DOCKER_COMPOSE logs --tail=30 moburb-app
            exit 1
        fi
        log_info "Tentativa $i/30 - aguardando..."
        sleep 2
    fi
done

# Verificar migrations
log_info "Verificando status das migrations..."
MIGRATION_STATUS=$($DOCKER_COMPOSE exec -T moburb-app npx prisma migrate status 2>&1 || echo "Erro ao verificar migrations")
if echo "$MIGRATION_STATUS" | grep -q "All migrations have been applied\|No pending migrations"; then
    log_success "✅ Migrations OK"
else
    log_warning "⚠️ Verificar migrations manualmente"
fi

log_success "🎉 Rebuild completo concluído!"
echo ""
echo "📊 Status:"
echo "   • Container: $(docker ps --format 'table {{.Names}}\t{{.Status}}' | grep moburb)"
echo "   • Image: $(docker images | grep mobiliario | head -1 | awk '{print $1 ":" $2 " (" $4 " " $5 ")"}')"
echo ""
echo "📄 Para ver logs:"
echo "   $DOCKER_COMPOSE logs -f moburb-app"
