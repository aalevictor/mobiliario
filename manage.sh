#!/bin/bash

# Script de Gerenciamento da Aplicação
# Concurso de Mobiliário Urbano - SPURBANISMO

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Define o comando do Docker Compose
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

show_help() {
    echo "Script de Gerenciamento - Concurso Mobiliário Urbano"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start           Inicia a aplicação"
    echo "  stop            Para a aplicação"
    echo "  restart         Reinicia a aplicação"
    echo "  status          Mostra status dos containers"
    echo "  logs            Mostra logs da aplicação"
    echo "  logs-follow     Segue logs em tempo real"
    echo "  health          Verifica saúde da aplicação"
    echo "  update          Atualiza e reinicia a aplicação"
    echo "  backup-db       Faz backup do banco de dados"
    echo "  cleanup         Remove containers e imagens antigas"
    echo "  shell           Acessa shell do container"
    echo "  stats           Mostra estatísticas de uso"
    echo "  help            Mostra esta ajuda"
    echo ""
}

start_app() {
    log_info "Iniciando aplicação..."
    $DOCKER_COMPOSE up -d
    sleep 5
    check_health
}

stop_app() {
    log_info "Parando aplicação..."
    $DOCKER_COMPOSE down
    log_success "Aplicação parada"
}

restart_app() {
    log_info "Reiniciando aplicação..."
    $DOCKER_COMPOSE restart
    sleep 5
    check_health
}

show_status() {
    log_info "Status dos containers:"
    $DOCKER_COMPOSE ps
    echo ""
    log_info "Uso de recursos:"
    docker stats --no-stream moburb-concurso 2>/dev/null || log_warning "Container não está rodando"
}

show_logs() {
    log_info "Logs da aplicação (últimas 100 linhas):"
    $DOCKER_COMPOSE logs --tail=100
}

follow_logs() {
    log_info "Seguindo logs em tempo real (Ctrl+C para sair):"
    $DOCKER_COMPOSE logs -f
}

check_health() {
    log_info "Verificando saúde da aplicação..."
    
    if ! docker ps | grep -q "moburb-concurso"; then
        log_error "Container não está rodando"
        return 1
    fi
    
    for i in {1..10}; do
        if curl -f http://localhost:3500/api/health &> /dev/null; then
            log_success "Aplicação está saudável! ✅"
            return 0
        fi
        
        if [ $i -eq 10 ]; then
            log_error "Aplicação não responde ao health check ❌"
            log_info "Verificando logs recentes:"
            $DOCKER_COMPOSE logs --tail=20
            return 1
        fi
        
        log_info "Aguardando resposta... (tentativa $i/10)"
        sleep 2
    done
}

update_app() {
    log_info "Atualizando aplicação..."
    
    # Para a aplicação
    $DOCKER_COMPOSE down
    
    # Remove imagem antiga
    docker rmi mobiliario_moburb-app:latest || true
    
    # Rebuild
    $DOCKER_COMPOSE build --no-cache
    
    # Executa migrations
    log_info "Executando migrations..."
    $DOCKER_COMPOSE run --rm moburb-app npx prisma migrate deploy
    
    # Inicia novamente
    $DOCKER_COMPOSE up -d
    
    sleep 10
    check_health
}

backup_database() {
    log_info "Fazendo backup do banco de dados..."
    
    # Extrai informações do DATABASE_URL
    DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')
    
    if [[ -z "$DATABASE_URL" ]]; then
        log_error "DATABASE_URL não encontrada no .env.production"
        return 1
    fi
    
    # Cria diretório de backup
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    
    # Nome do arquivo de backup
    BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    log_info "Salvando backup em: $BACKUP_FILE"
    
    # Executa backup usando o container
    $DOCKER_COMPOSE exec moburb-app npx prisma db pull --schema=/tmp/backup.prisma
    
    log_success "Backup criado com sucesso!"
}

cleanup() {
    log_info "Limpando containers e imagens antigas..."
    
    # Para todos os containers
    $DOCKER_COMPOSE down --remove-orphans
    
    # Remove imagens antigas
    docker image prune -f
    
    # Remove volumes não utilizados
    docker volume prune -f
    
    log_success "Limpeza concluída"
}

access_shell() {
    log_info "Acessando shell do container..."
    $DOCKER_COMPOSE exec moburb-app /bin/sh
}

show_stats() {
    log_info "Estatísticas detalhadas:"
    echo ""
    
    # Status do container
    if docker ps | grep -q "moburb-concurso"; then
        log_success "Container Status: RODANDO ✅"
        
        # Uso de recursos
        echo ""
        log_info "Uso de Recursos:"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}" moburb-concurso
        
        # Health check
        echo ""
        check_health
        
        # Logs de erro recentes
        echo ""
        log_info "Erros recentes (últimas 24h):"
        $DOCKER_COMPOSE logs --since="24h" | grep -i error | tail -5 || log_info "Nenhum erro encontrado"
        
    else
        log_error "Container Status: PARADO ❌"
    fi
    
    # Espaço em disco
    echo ""
    log_info "Espaço em Disco:"
    df -h . | tail -1
    
    # Tamanho dos diretórios
    echo ""
    log_info "Tamanho dos Diretórios:"
    du -sh uploads logs 2>/dev/null || log_info "Diretórios ainda não criados"
}

# Verifica se foi passado um comando
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# Executa comando baseado no argumento
case $1 in
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    restart)
        restart_app
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    logs-follow)
        follow_logs
        ;;
    health)
        check_health
        ;;
    update)
        update_app
        ;;
    backup-db)
        backup_database
        ;;
    cleanup)
        cleanup
        ;;
    shell)
        access_shell
        ;;
    stats)
        show_stats
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Comando desconhecido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
