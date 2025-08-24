#!/bin/bash

# Script para rebuild apenas da aplicação (sem deploy completo)
# Use quando houver apenas mudanças de código

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

echo "🔨 REBUILD - Apenas Aplicação"
echo "============================"

# Verificar se o container existe
if ! docker ps -a | grep -q "moburb-concurso-centos7"; then
    log_error "Container não existe. Execute primeiro: ./deploy-centos7.sh"
    exit 1
fi

# Para o container
log_info "Parando container..."
$DOCKER_COMPOSE stop moburb-app

# Rebuild apenas a imagem (sem --no-cache para ser mais rápido)
log_info "Fazendo rebuild da imagem..."
$DOCKER_COMPOSE build moburb-app

# Reinicia o container
log_info "Reiniciando container..."
$DOCKER_COMPOSE up -d moburb-app

# Aguarda aplicação ficar pronta
log_info "Aguardando aplicação inicializar..."
sleep 15

# Verifica se está funcionando
log_info "Verificando se aplicação está respondendo..."
for i in {1..20}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Aplicação funcionando após rebuild!"
        break
    else
        if [ $i -eq 20 ]; then
            log_error "❌ Aplicação não respondeu após rebuild"
            log_info "Verificando logs..."
            $DOCKER_COMPOSE logs --tail=20 moburb-app
            exit 1
        fi
        log_info "Tentativa $i/20 - aguardando..."
        sleep 2
    fi
done

log_success "🎉 Rebuild concluído com sucesso!"
echo ""
echo "📊 Status:"
echo "   • Container: $(docker ps --format 'table {{.Names}}\t{{.Status}}' | grep moburb)"
echo "   • Health: http://localhost:3500/api/health"
echo ""
echo "📄 Para ver logs:"
echo "   $DOCKER_COMPOSE logs -f moburb-app"
