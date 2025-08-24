#!/bin/bash

# Script para restart rápido (sem rebuild)
# Use quando quiser apenas reiniciar a aplicação

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

DOCKER_COMPOSE="docker-compose -f docker-compose.centos7.yml"

echo "🔄 RESTART - Apenas Reiniciar"
echo "============================"

# Verificar se o container existe
if ! docker ps -a | grep -q "moburb-concurso-centos7"; then
    log_error "Container não existe. Execute primeiro: ./deploy-centos7.sh"
    exit 1
fi

# Restart rápido
log_info "Reiniciando container..."
$DOCKER_COMPOSE restart moburb-app

# Aguarda aplicação ficar pronta
log_info "Aguardando aplicação inicializar..."
sleep 10

# Verifica se está funcionando
log_info "Verificando se aplicação está respondendo..."
for i in {1..15}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Aplicação funcionando após restart!"
        break
    else
        if [ $i -eq 15 ]; then
            log_error "❌ Aplicação não respondeu após restart"
            log_info "Verificando logs..."
            $DOCKER_COMPOSE logs --tail=15 moburb-app
            exit 1
        fi
        log_info "Tentativa $i/15 - aguardando..."
        sleep 2
    fi
done

log_success "🎉 Restart concluído com sucesso!"
echo ""
echo "📊 Status:"
echo "   • Container: $(docker ps --format 'table {{.Names}}\t{{.Status}}' | grep moburb)"
echo "   • Uptime: $(docker ps --format 'table {{.Names}}\t{{.Status}}' | grep moburb | awk '{print $2, $3, $4}')"
echo ""
echo "📄 Para ver logs:"
echo "   $DOCKER_COMPOSE logs -f moburb-app"
