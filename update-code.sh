#!/bin/bash

# Script para atualizar apenas código sem rebuild do container

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

echo "🔄 ATUALIZAÇÃO RÁPIDA DE CÓDIGO"
echo "==============================="

# Detecta qual ambiente usar
if [ -f "docker-compose.dev.yml" ] && docker ps | grep -q moburb-development; then
    COMPOSE_FILE="docker-compose.dev.yml"
    CONTAINER_NAME="moburb-development"
    MODE="DESENVOLVIMENTO"
elif [ -f "docker-compose.yml" ] && docker ps | grep -q moburb; then
    COMPOSE_FILE="docker-compose.yml"
    CONTAINER_NAME=$(docker ps | grep moburb | awk '{print $NF}' | head -1)
    MODE="PRODUÇÃO"
else
    log_error "❌ Nenhum container encontrado rodando"
    log_info "Execute primeiro: ./deploy.sh ou docker-compose up"
    exit 1
fi

log_info "Modo detectado: $MODE"
log_info "Container: $CONTAINER_NAME"

if [ "$MODE" = "DESENVOLVIMENTO" ]; then
    log_info "🔥 Hot-reload ativo - mudanças aplicadas automaticamente"
    log_info "Verificando se aplicação está respondendo..."
    
    # Verifica se está funcionando
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Aplicação funcionando - mudanças são aplicadas automaticamente"
        log_info "📝 Logs em tempo real:"
        docker-compose -f $COMPOSE_FILE logs -f moburb-dev --tail=10
    else
        log_error "❌ Aplicação não está respondendo"
        log_info "Verificando logs..."
        docker-compose -f $COMPOSE_FILE logs moburb-dev --tail=20
        exit 1
    fi
    
else
    log_info "🏗️ Modo produção - aplicando atualização incremental..."
    
    # Para produção: copia arquivos e reinicia processo Node.js
    log_info "1. Copiando arquivos atualizados..."
    
    # Copia código TypeScript/React para container
    docker cp ./app $CONTAINER_NAME:/app/app-new
    docker cp ./components $CONTAINER_NAME:/app/components-new
    docker cp ./lib $CONTAINER_NAME:/app/lib-new
    docker cp ./services $CONTAINER_NAME:/app/services-new
    
    # Executa build dentro do container
    log_info "2. Fazendo build dentro do container..."
    docker exec $CONTAINER_NAME sh -c "
        mv /app/app /app/app-backup &&
        mv /app/components /app/components-backup &&
        mv /app/lib /app/lib-backup &&
        mv /app/services /app/services-backup &&
        mv /app/app-new /app/app &&
        mv /app/components-new /app/components &&
        mv /app/lib-new /app/lib &&
        mv /app/services-new /app/services &&
        npm run build
    "
    
    if [ $? -eq 0 ]; then
        log_info "3. Reiniciando aplicação..."
        # Reinicia processo Node.js sem reiniciar container
        docker exec $CONTAINER_NAME sh -c "pkill -f 'npm start' || pkill -f 'node' || true"
        docker exec -d $CONTAINER_NAME npm start
        
        log_info "4. Aguardando aplicação inicializar..."
        sleep 10
        
        # Verifica se funcionou
        if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
            log_success "✅ Atualização aplicada com sucesso!"
            
            # Remove backups
            docker exec $CONTAINER_NAME sh -c "rm -rf /app/app-backup /app/components-backup /app/lib-backup /app/services-backup"
        else
            log_error "❌ Atualização falhou - restaurando backup..."
            docker exec $CONTAINER_NAME sh -c "
                mv /app/app /app/app-failed &&
                mv /app/components /app/components-failed &&
                mv /app/lib /app/lib-failed &&
                mv /app/services /app/services-failed &&
                mv /app/app-backup /app/app &&
                mv /app/components-backup /app/components &&
                mv /app/lib-backup /app/lib &&
                mv /app/services-backup /app/services &&
                npm start
            " &
            exit 1
        fi
    else
        log_error "❌ Build falhou - restaurando backup..."
        docker exec $CONTAINER_NAME sh -c "
            mv /app/app /app/app-failed &&
            mv /app/components /app/components-failed &&
            mv /app/lib /app/lib-failed &&
            mv /app/services /app/services-failed &&
            mv /app/app-backup /app/app &&
            mv /app/components-backup /app/components &&
            mv /app/lib-backup /app/lib &&
            mv /app/services-backup /app/services
        "
        exit 1
    fi
fi

log_success "🎉 CÓDIGO ATUALIZADO!"
echo ""
echo "📊 Resumo:"
echo "   • Modo: $MODE"
echo "   • Container: $CONTAINER_NAME"
echo "   • Tempo: ~30s (sem rebuild)"
echo ""
echo "🌐 Aplicação disponível:"
echo "   http://localhost:3500"
