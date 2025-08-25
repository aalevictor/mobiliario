#!/bin/bash

# Script para restart rápido sem parar container

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

echo "⚡ RESTART RÁPIDO"
echo "================"

# Detecta container
CONTAINER_NAME=$(docker ps | grep moburb | awk '{print $NF}' | head -1)

if [ -z "$CONTAINER_NAME" ]; then
    log_error "❌ Container não encontrado"
    exit 1
fi

log_info "Container: $CONTAINER_NAME"

# Mata processo Node.js atual
log_info "1. Parando processo Node.js..."
docker exec $CONTAINER_NAME sh -c "pkill -f 'npm start' || pkill -f 'node' || true"

# Aguarda um pouco
sleep 3

# Inicia novamente
log_info "2. Iniciando aplicação..."
docker exec -d $CONTAINER_NAME npm start

# Verifica
log_info "3. Verificando aplicação..."
sleep 10

for i in {1..15}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Aplicação reiniciada com sucesso!"
        exit 0
    fi
    log_info "Tentativa $i/15..."
    sleep 2
done

log_error "❌ Aplicação não respondeu após restart"
docker logs $CONTAINER_NAME --tail=10
