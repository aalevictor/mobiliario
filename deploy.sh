#!/bin/bash

# Script de Deploy para CentOS 7
# Concurso de Mobiliário Urbano - SPURBANISMO

set -e

echo "🚀 Iniciando deploy da aplicação Mobiliário Urbano..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica se está rodando como root ou com sudo
if [[ $EUID -eq 0 ]]; then
   log_warning "Rodando como root. Recomenda-se usar um usuário com sudo."
fi

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

# Verifica se o Docker Compose está disponível
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

# Define o comando do Docker Compose
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

log_info "Usando $DOCKER_COMPOSE"

# Cria diretórios necessários
log_info "Criando diretórios necessários..."
mkdir -p uploads logs

# Verifica se o arquivo .env.production existe
if [ ! -f ".env.production" ]; then
    log_warning "Arquivo .env.production não encontrado."
    log_info "Criando .env.production baseado no exemplo..."
    
    if [ -f "env.production.example" ]; then
        cp env.production.example .env.production
        log_warning "Configure as variáveis em .env.production antes de continuar!"
        log_warning "Especialmente DATABASE_URL e AUTH_SECRET"
        read -p "Pressione Enter para continuar após configurar o .env.production..."
    else
        log_error "Arquivo env.production.example não encontrado!"
        exit 1
    fi
fi

# Para o container se estiver rodando
log_info "Parando containers existentes..."
$DOCKER_COMPOSE down --remove-orphans || true

# Remove imagens antigas para forçar rebuild
log_info "Removendo imagens antigas..."
docker rmi moburb-concurso:latest || true
docker rmi mobiliario_moburb-app:latest || true

# Faz o build da nova imagem
log_info "Construindo nova imagem Docker..."
$DOCKER_COMPOSE build --no-cache

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
sleep 10

# Verifica se o container está rodando
if docker ps | grep -q "moburb-concurso"; then
    log_success "Container iniciado com sucesso!"
else
    log_error "Falha ao iniciar o container"
    log_info "Verificando logs..."
    $DOCKER_COMPOSE logs
    exit 1
fi

# Testa o health check
log_info "Testando health check..."
for i in {1..30}; do
    if curl -f http://localhost:3500/api/health &> /dev/null; then
        log_success "Aplicação está saudável!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        log_error "Aplicação não respondeu ao health check após 30 tentativas"
        log_info "Verificando logs..."
        $DOCKER_COMPOSE logs --tail=50
        exit 1
    fi
    
    log_info "Aguardando aplicação... (tentativa $i/30)"
    sleep 2
done

# Mostra informações finais
log_success "🎉 Deploy concluído com sucesso!"
echo ""
log_info "Informações do deploy:"
echo "  • URL: https://concursomoburb.prefeitura.sp.gov.br"
echo "  • Porta local: 3500"
echo "  • Container: moburb-concurso"
echo ""
log_info "Comandos úteis:"
echo "  • Ver logs: $DOCKER_COMPOSE logs -f"
echo "  • Parar: $DOCKER_COMPOSE down"
echo "  • Reiniciar: $DOCKER_COMPOSE restart"
echo "  • Status: $DOCKER_COMPOSE ps"
echo ""
log_info "Arquivos importantes:"
echo "  • Logs da aplicação: ./logs/"
echo "  • Uploads: ./uploads/"
echo "  • Configuração: .env.production"
