#!/bin/bash

# Script de teste específico para CentOS 7
# Testa diferentes abordagens para resolver o problema do entrypoint

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

echo "🧪 TESTE DE DEBUG PARA CENTOS 7"
echo "================================"

# Verificar versões
log_info "Verificando versões do sistema..."
echo "OS: $(cat /etc/redhat-release 2>/dev/null || echo 'Não é RedHat/CentOS')"
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker-compose --version)"

# Limpeza total primeiro
log_info "🧹 Limpeza total do Docker..."
docker-compose -f docker-compose.debug.yml down -v --remove-orphans 2>/dev/null || true
docker rm -f moburb-debug moburb-minimal moburb-concurso 2>/dev/null || true

# Remove todas as imagens do projeto
log_info "🗑️ Removendo todas as imagens..."
docker images | grep -E "(moburb|mobiliario)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Limpeza de cache
log_info "🧽 Limpando cache..."
docker system prune -f 2>/dev/null || true

# TESTE 1: Container minimal (apenas echo)
log_info "📋 TESTE 1: Container minimal..."
docker-compose -f docker-compose.debug.yml build moburb-app-minimal --no-cache
log_info "Iniciando container minimal..."
docker-compose -f docker-compose.debug.yml up -d moburb-app-minimal

sleep 5

# Verificar logs do minimal
log_info "Verificando logs do container minimal..."
MINIMAL_LOGS=$(docker-compose -f docker-compose.debug.yml logs moburb-app-minimal 2>&1)
echo "$MINIMAL_LOGS"

if echo "$MINIMAL_LOGS" | grep -q "docker-entrypoint.sh"; then
    log_error "❌ TESTE 1 FALHOU: Ainda há referência ao entrypoint!"
    log_error "Isso indica problema na imagem base ou cache muito persistente"
else
    log_success "✅ TESTE 1 PASSOU: Container minimal funciona"
fi

# Para o minimal
docker-compose -f docker-compose.debug.yml stop moburb-app-minimal

# TESTE 2: Container com npm start
log_info "📋 TESTE 2: Container com npm start..."
docker-compose -f docker-compose.debug.yml up -d moburb-app-debug

sleep 10

# Verificar logs do debug
log_info "Verificando logs do container debug..."
DEBUG_LOGS=$(docker-compose -f docker-compose.debug.yml logs moburb-app-debug 2>&1)
echo "$DEBUG_LOGS"

if echo "$DEBUG_LOGS" | grep -q "docker-entrypoint.sh"; then
    log_error "❌ TESTE 2 FALHOU: Ainda há referência ao entrypoint!"
    
    # Investigação mais profunda
    log_info "🔍 Investigação mais profunda..."
    
    # Verificar a imagem
    IMAGE_ID=$(docker images | grep mobiliario | head -1 | awk '{print $3}')
    if [ -n "$IMAGE_ID" ]; then
        log_info "Inspecionando imagem $IMAGE_ID..."
        docker inspect $IMAGE_ID | grep -A 5 -B 5 -i entrypoint || echo "Sem entrypoint na imagem"
    fi
    
    # Verificar container
    log_info "Inspecionando container..."
    docker inspect moburb-debug | grep -A 5 -B 5 -i entrypoint || echo "Sem entrypoint no container"
    
else
    log_success "✅ TESTE 2 PASSOU: Container debug funciona"
    
    # Verificar se a aplicação está respondendo
    log_info "Testando se aplicação responde..."
    sleep 15  # Aguarda mais tempo para a aplicação iniciar
    
    if curl -f http://localhost:3501/api/health 2>/dev/null; then
        log_success "🎉 APLICAÇÃO FUNCIONANDO!"
    else
        log_warning "⚠️ Aplicação não responde ainda (pode precisar de mais tempo)"
    fi
fi

# Limpar tudo
log_info "🧹 Limpando containers de teste..."
docker-compose -f docker-compose.debug.yml down

echo ""
echo "📊 RESUMO DOS TESTES:"
echo "===================="
if echo "$MINIMAL_LOGS" | grep -q "docker-entrypoint.sh"; then
    echo "❌ Problema na imagem base ou cache persistente"
    echo "💡 Sugestões:"
    echo "   1. Tentar imagem base diferente (node:20-slim ao invés de alpine)"
    echo "   2. Verificar se há proxy ou registry cache"
    echo "   3. Usar docker build --no-cache --pull"
else
    echo "✅ Imagem base está OK"
    if echo "$DEBUG_LOGS" | grep -q "docker-entrypoint.sh"; then
        echo "❌ Problema específico com Node.js/npm"
        echo "💡 Sugestão: Verificar package.json ou dependências"
    else
        echo "✅ Tudo funcionando - problema pode ser específico do comando original"
    fi
fi

echo ""
echo "🎯 Próximos passos recomendados:"
echo "   1. Se testes passaram: usar docker-compose.debug.yml como base"
echo "   2. Se falharam: tentar imagem base diferente"
echo "   3. Verificar logs específicos do CentOS 7"
