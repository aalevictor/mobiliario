#!/bin/bash

# Script específico para corrigir libmysqlclient.so.18 no Alpine

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

echo "🔧 CORREÇÃO ESPECÍFICA: libmysqlclient.so.18"
echo "============================================"

log_info "Problema: Prisma procura libmysqlclient.so.18 específica"
log_info "Solução: Link simbólico + mariadb-dev"

# Para containers
log_info "Parando containers..."
$DOCKER_COMPOSE down 2>/dev/null || true

# Remove imagens antigas
log_info "Removendo imagens antigas..."
docker images | grep mobiliario | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Rebuild com correção
log_info "Rebuild com correção da biblioteca MySQL..."
$DOCKER_COMPOSE build --no-cache --pull

log_info "Iniciando container..."
$DOCKER_COMPOSE up -d

# Aguarda mais tempo para o Prisma
log_info "Aguardando Prisma + MySQL inicializar..."
sleep 30

# Verifica se o erro persiste
log_info "Verificando logs para erro MySQL..."
if $DOCKER_COMPOSE logs moburb-app 2>&1 | grep -i "libmysqlclient.so.18" >/dev/null; then
    log_error "❌ Erro ainda presente nos logs"
    
    # Tenta correção dentro do container
    log_info "Tentando correção dinâmica no container..."
    $DOCKER_COMPOSE exec moburb-app sh -c "
        find /usr/lib -name '*mysql*' -o -name '*maria*' 2>/dev/null | head -10
        ls -la /usr/lib/libmariadb* 2>/dev/null || echo 'MariaDB libs não encontradas'
        ln -sf /usr/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.18 2>/dev/null || 
        ln -sf /usr/lib/libmariadb.so /usr/lib/libmysqlclient.so.18 2>/dev/null ||
        echo 'Link simbólico falhou'
    " 2>/dev/null || log_info "Comando no container falhou (esperado se container não estiver rodando)"
    
    # Restart para aplicar correção
    log_info "Reiniciando container..."
    $DOCKER_COMPOSE restart moburb-app
    sleep 20
    
else
    log_success "✅ Erro libmysqlclient.so.18 não encontrado nos logs!"
fi

# Teste final
log_info "Teste final da aplicação..."
for i in {1..20}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ Aplicação funcionando!"
        
        # Verifica versão das bibliotecas
        log_info "Verificando bibliotecas MySQL instaladas..."
        $DOCKER_COMPOSE exec -T moburb-app sh -c "
            echo '📚 Bibliotecas encontradas:'
            find /usr/lib -name '*mysql*' -o -name '*maria*' 2>/dev/null | head -5
            echo '🔗 Links simbólicos:'
            ls -la /usr/lib/libmysqlclient.so.18 2>/dev/null || echo 'Link não encontrado'
        " 2>/dev/null || echo "Informações de biblioteca não disponíveis"
        
        break
    else
        if [ $i -eq 20 ]; then
            log_error "❌ Aplicação não respondeu"
            log_info "Últimos logs:"
            $DOCKER_COMPOSE logs --tail=10 moburb-app
            exit 1
        fi
        log_info "Tentativa $i/20..."
        sleep 3
    fi
done

log_success "🎉 PROBLEMA libmysqlclient.so.18 RESOLVIDO!"
echo ""
echo "📊 Solução aplicada:"
echo "   • mariadb-dev → Bibliotecas de desenvolvimento"
echo "   • Link simbólico → /usr/lib/libmysqlclient.so.18"
echo "   • PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1"
echo ""
echo "🚀 Aplicação funcionando em:"
echo "   https://concursomoburb.prefeitura.sp.gov.br"
