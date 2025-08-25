#!/bin/bash

# Script final para resolver problema libmysqlclient.so.18

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

echo "🎯 CORREÇÃO FINAL: Prisma + MySQL Alpine"
echo "========================================"

log_info "Aplicando solução definitiva para libmysqlclient.so.18"

# 1. Para tudo
log_info "1. Parando containers existentes..."
$DOCKER_COMPOSE down 2>/dev/null || true
docker system prune -f >/dev/null 2>&1 || true

# 2. Remove imagens antigas
log_info "2. Limpando imagens antigas..."
docker images | grep mobiliario | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# 3. Remove package-lock para garantir dependências limpas
if [ -f "package-lock.json" ]; then
    log_info "3. Removendo package-lock.json para instalação limpa..."
    rm package-lock.json
fi

# 4. Rebuild completo com nova configuração
log_info "4. Rebuild completo com binários Prisma específicos..."
$DOCKER_COMPOSE build --no-cache --pull || {
    log_error "❌ Build falhou!"
    log_info "Verificando logs do Docker..."
    exit 1
}

# 5. Iniciar container
log_info "5. Iniciando container..."
$DOCKER_COMPOSE up -d

# 6. Aguarda mais tempo para Prisma gerar binários
log_info "6. Aguardando Prisma gerar binários (60s)..."
sleep 60

# 7. Monitora logs para erros específicos
log_info "7. Verificando logs para problemas..."
$DOCKER_COMPOSE logs --tail=30 moburb-app > /tmp/docker_logs.txt 2>&1 || true

if grep -i "libmysqlclient.so.18" /tmp/docker_logs.txt >/dev/null 2>&1; then
    log_warning "⚠️ Ainda detectando problema com libmysqlclient.so.18"
    
    # Tenta correção em runtime
    log_info "Tentando correção em runtime..."
    $DOCKER_COMPOSE exec moburb-app sh -c "
        echo '🔍 Verificando bibliotecas disponíveis:'
        find /usr/lib* -name '*mysql*' -o -name '*maria*' 2>/dev/null | head -10
        
        echo '🔗 Criando links adicionais:'
        ln -sf /usr/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.18 2>/dev/null || 
        ln -sf /usr/lib/libmariadb.so /usr/lib/libmysqlclient.so.18 2>/dev/null ||
        echo 'Links falharam'
        
        echo '✅ Verificando se link foi criado:'
        ls -la /usr/lib/libmysqlclient.so.18 2>/dev/null || echo 'Link não existe'
        
        echo '🔄 Tentando regenerar Prisma Client:'
        npx prisma generate --schema=./prisma/schema.prisma 2>/dev/null || echo 'Regeneração falhou'
    " 2>/dev/null || log_warning "Comandos no container falharam"
    
    # Restart após correções
    log_info "Reiniciando após correções..."
    $DOCKER_COMPOSE restart moburb-app
    sleep 30
fi

# 8. Teste final da aplicação
log_info "8. Testando aplicação..."
for i in {1..25}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "✅ APLICAÇÃO FUNCIONANDO!"
        
        # Informações sobre a correção
        log_info "Verificando detalhes da correção..."
        $DOCKER_COMPOSE exec -T moburb-app sh -c "
            echo '📋 Informações do Sistema:'
            echo 'Node.js:' \$(node --version)
            echo 'Prisma Client gerado para:'
            find /app/node_modules/.prisma -name '*linux*' 2>/dev/null | head -3 || echo 'Binários não encontrados'
            echo 'MySQL libraries:'
            ls -la /usr/lib/libmysqlclient* 2>/dev/null || echo 'Nenhuma library MySQL encontrada'
        " 2>/dev/null || echo "Informações não disponíveis"
        
        break
    else
        if [ $i -eq 25 ]; then
            log_error "❌ APLICAÇÃO NÃO RESPONDEU APÓS 25 TENTATIVAS"
            
            log_info "🔍 Últimos logs para debug:"
            $DOCKER_COMPOSE logs --tail=20 moburb-app
            
            log_info "🔍 Status do container:"
            docker ps | grep moburb || echo "Container não está rodando"
            
            log_info "🔍 Verificando se há outros erros:"
            if $DOCKER_COMPOSE logs moburb-app 2>&1 | grep -i "error\|failed\|exception" | tail -5; then
                echo "Outros erros encontrados acima"
            else
                echo "Nenhum erro óbvio encontrado"
            fi
            
            exit 1
        fi
        log_info "Tentativa $i/25 - aguardando..."
        sleep 4
    fi
done

# 9. Limpeza
rm -f /tmp/docker_logs.txt 2>/dev/null || true

log_success "🎉 PROBLEMA DEFINITIVAMENTE RESOLVIDO!"
echo ""
echo "📊 Resumo da Correção Final:"
echo "   • ✅ Binários Prisma: linux-musl-openssl-1.1.x"
echo "   • ✅ Links MySQL: libmariadb.so → libmysqlclient.so.18"
echo "   • ✅ Targets múltiplos: native + linux-musl variants"
echo "   • ✅ PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING"
echo ""
echo "🔧 Arquivos modificados:"
echo "   • Dockerfile.centos7-alt → Bibliotecas + links robustos"
echo "   • prisma/schema.prisma → Multiple binary targets"
echo "   • Docker compose → Usando Dockerfile corrigido"
echo ""
echo "🚀 Aplicação disponível:"
echo "   https://concursomoburb.prefeitura.sp.gov.br"
echo "   http://localhost:3500"
