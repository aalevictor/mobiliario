#!/bin/bash

# Script de deploy específico para CentOS 7
# Usa docker-compose.centos7.yml e Dockerfile.centos7

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

# Verificações iniciais
if [[ $EUID -ne 0 ]] && ! groups $USER | grep -q docker; then
    log_error "Este script precisa ser executado como root ou usuário no grupo docker"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não está instalado"
    exit 1
fi

# Verifica se arquivos necessários existem
if [[ ! -f "docker-compose.centos7.yml" ]]; then
    log_error "Arquivo docker-compose.centos7.yml não encontrado"
    exit 1
fi

if [[ ! -f "Dockerfile.centos7" ]]; then
    log_error "Arquivo Dockerfile.centos7 não encontrado"
    exit 1
fi

if [[ ! -f ".env.production" ]]; then
    log_error "Arquivo .env.production não encontrado"
    log_info "Crie o arquivo baseado em env.production.example"
    exit 1
fi

# Define comando docker-compose
DOCKER_COMPOSE="docker-compose -f docker-compose.centos7.yml"

echo "🚀 DEPLOY PARA CENTOS 7 - MOBILIÁRIO URBANO"
echo "============================================"

# Para o container se estiver rodando
log_info "Parando containers existentes..."
$DOCKER_COMPOSE down --remove-orphans || true

# Remove containers órfãos específicos
log_info "Removendo containers órfãos..."
docker rm -f moburb-concurso-centos7 moburb-concurso moburb-app 2>/dev/null || true

# Remove imagens antigas para forçar rebuild
log_info "Removendo imagens antigas..."
docker rmi moburb-concurso-centos7:latest || true
docker rmi mobiliario_moburb-app:latest || true
docker images | grep -E "(moburb|mobiliario)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Faz o build da nova imagem
log_info "Construindo nova imagem Docker (CentOS 7 otimizada)..."
$DOCKER_COMPOSE build --no-cache --pull

# Verifica se o banco está acessível
log_info "Verificando conectividade com o banco de dados..."
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')
if [[ -z "$DATABASE_URL" ]]; then
    log_error "DATABASE_URL não configurada no .env.production"
    exit 1
fi

# Inicia os containers (migrations e seed executam automaticamente)
log_info "Iniciando containers com setup automático..."
$DOCKER_COMPOSE up -d

# Aguarda o container ficar saudável
log_info "Aguardando aplicação inicializar..."
sleep 15

# Verifica se o container está rodando
if docker ps | grep -q "moburb-concurso-centos7"; then
    log_success "Container iniciado com sucesso!"
    
    # Testa o health check
    log_info "Testando health check da aplicação..."
    for i in {1..30}; do
        if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
            log_success "✅ Aplicação respondendo ao health check!"
            break
        else
            if [ $i -eq 30 ]; then
                log_error "Aplicação não respondeu ao health check após 30 tentativas"
                log_info "Verificando logs..."
                $DOCKER_COMPOSE logs --tail=20 moburb-app
                exit 1
            fi
            log_info "Tentativa $i/30 - aguardando aplicação..."
            sleep 2
        fi
    done
    
    log_success "🎉 Deploy concluído com sucesso!"
    echo ""
    echo "📊 Informações do Deploy:"
    echo "   • Container: moburb-concurso-centos7"
    echo "   • Porta: 3500"
    echo "   • Health Check: http://localhost:3500/api/health"
    echo "   • Logs: docker-compose -f docker-compose.centos7.yml logs -f moburb-app"
    echo ""
    echo "🌐 Aplicação disponível em:"
    echo "   https://concursomoburb.prefeitura.sp.gov.br"
    
else
    log_error "Container não está rodando"
    log_info "Verificando logs de erro..."
    $DOCKER_COMPOSE logs moburb-app
    exit 1
fi

# Mostra logs finais
log_info "Últimas linhas dos logs:"
$DOCKER_COMPOSE logs --tail=10 moburb-app

echo ""
log_success "🎯 Deploy finalizado!"
echo "Para monitorar: docker-compose -f docker-compose.centos7.yml logs -f moburb-app"
