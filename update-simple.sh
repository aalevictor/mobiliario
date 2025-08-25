#!/bin/bash

# Script simplificado para atualização de código sem backup complexo

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

echo "🔄 ATUALIZAÇÃO SIMPLES DE CÓDIGO"
echo "================================"

# Detecta container rodando
CONTAINER_NAME=$(docker ps | grep moburb | awk '{print $NF}' | head -1)

if [ -z "$CONTAINER_NAME" ]; then
    log_error "❌ Nenhum container moburb encontrado"
    log_info "Execute primeiro: ./deploy.sh"
    exit 1
fi

log_info "Container encontrado: $CONTAINER_NAME"

# Método simples: rebuild com cache + restart
log_info "1. Fazendo rebuild com cache (rápido)..."
docker-compose -f docker-compose.yml build

log_info "2. Aplicando mudanças sem perder dados..."
docker-compose -f docker-compose.yml up -d --no-deps moburb-app

log_info "3. Aguardando aplicação inicializar..."
sleep 20

# Verifica se funcionou
log_info "4. Verificando aplicação..."
for i in {1..15}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Atualização aplicada com sucesso!"
        break
    fi
    
    if [ $i -eq 15 ]; then
        log_error "❌ Aplicação não respondeu após atualização"
        log_info "Verificando logs..."
        docker logs $CONTAINER_NAME --tail=20
        exit 1
    fi
    
    log_info "Tentativa $i/15..."
    sleep 3
done

log_success "🎉 CÓDIGO ATUALIZADO!"
echo ""
echo "📊 Resumo:"
echo "   • Método: Rebuild com cache"
echo "   • Container: $CONTAINER_NAME"
echo "   • Tempo: ~2-3 minutos"
echo "   • Dados: Preservados"
echo ""
echo "🌐 Aplicação disponível:"
echo "   http://localhost:3500"
