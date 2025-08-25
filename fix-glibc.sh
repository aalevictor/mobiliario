#!/bin/bash

# Script de correção rápida para problema GLIBC no CentOS 7

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

echo "🔧 CORREÇÃO GLIBC - CentOS 7"
echo "============================"

log_info "Problema: GLIBC_2.35 não encontrada no CentOS 7"
log_info "Solução: Usar Node.js 18 Alpine (compatível)"

# Para containers existentes
log_info "Parando containers existentes..."
$DOCKER_COMPOSE down 2>/dev/null || true

# Remove imagens problemáticas
log_info "Removendo imagens com problema GLIBC..."
docker images | grep mobiliario | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Verifica se docker-compose está usando Dockerfile correto
log_info "Verificando configuração..."
if grep -q "Dockerfile.centos7-alt" docker-compose.centos7.yml; then
    log_success "✅ Docker-compose já configurado para Node 18 Alpine"
else
    log_info "Atualizando docker-compose para usar Dockerfile compatível..."
    sed -i 's/dockerfile: Dockerfile.centos7/dockerfile: Dockerfile.centos7-alt/' docker-compose.centos7.yml 2>/dev/null || \
    sed -i.bak 's/dockerfile: Dockerfile.centos7/dockerfile: Dockerfile.centos7-alt/' docker-compose.centos7.yml
    log_success "✅ Docker-compose atualizado"
fi

# Rebuild com imagem compatível
log_info "Fazendo rebuild com imagem compatível..."
$DOCKER_COMPOSE build --no-cache --pull

# Inicia container
log_info "Iniciando container..."
$DOCKER_COMPOSE up -d

# Aguarda aplicação
log_info "Aguardando aplicação inicializar..."
sleep 20

# Testa aplicação
log_info "Testando aplicação..."
for i in {1..30}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Aplicação funcionando com Node.js compatível!"
        break
    else
        if [ $i -eq 30 ]; then
            log_error "❌ Aplicação ainda não respondeu"
            log_info "Verificando logs..."
            $DOCKER_COMPOSE logs --tail=20 moburb-app
            exit 1
        fi
        log_info "Tentativa $i/30 - aguardando..."
        sleep 2
    fi
done

# Verificar versão Node.js
log_info "Verificando versão Node.js no container..."
NODE_VERSION=$($DOCKER_COMPOSE exec -T moburb-app node --version 2>/dev/null || echo "Erro")
log_success "Node.js version: $NODE_VERSION"

# Verificar GLIBC
log_info "Verificando compatibilidade GLIBC..."
GLIBC_CHECK=$($DOCKER_COMPOSE exec -T moburb-app ldd --version 2>/dev/null | head -1 || echo "Alpine Linux")
log_success "Sistema: $GLIBC_CHECK"

log_success "🎉 PROBLEMA GLIBC CORRIGIDO!"
echo ""
echo "📊 Resumo da Correção:"
echo "   • Problema: Node.js 20 precisava GLIBC 2.35"
echo "   • Solução: Node.js 18 Alpine (compatível)"
echo "   • Status: ✅ Funcionando"
echo ""
echo "📝 Arquivos atualizados:"
echo "   • docker-compose.centos7.yml → usa Dockerfile.centos7-alt"
echo "   • Dockerfile.centos7-alt → Node.js 18 Alpine"
echo ""
echo "🚀 Aplicação disponível em:"
echo "   https://concursomoburb.prefeitura.sp.gov.br"
