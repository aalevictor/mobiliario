#!/bin/bash

# Script para instalar Docker e Docker Compose no CentOS 7
# Concurso de Mobiliário Urbano - SPURBANISMO

set -e

echo "🐳 Instalando Docker no CentOS 7..."

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

# Verifica se está rodando como root
if [[ $EUID -ne 0 ]]; then
   log_error "Este script deve ser executado como root (use sudo)"
   exit 1
fi

# Verifica a versão do CentOS
if ! grep -q "CentOS Linux release 7" /etc/centos-release 2>/dev/null; then
    log_warning "Este script foi testado apenas no CentOS 7"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Remove versões antigas do Docker
log_info "Removendo versões antigas do Docker..."
yum remove -y docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine || true

# Instala dependências
log_info "Instalando dependências..."
yum install -y yum-utils device-mapper-persistent-data lvm2 curl

# Adiciona repositório oficial do Docker
log_info "Adicionando repositório do Docker..."
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Instala Docker CE
log_info "Instalando Docker CE..."
yum install -y docker-ce docker-ce-cli containerd.io

# Inicia e habilita o Docker
log_info "Iniciando e habilitando o Docker..."
systemctl start docker
systemctl enable docker

# Verifica instalação do Docker
if docker --version > /dev/null 2>&1; then
    log_success "Docker instalado com sucesso: $(docker --version)"
else
    log_error "Falha na instalação do Docker"
    exit 1
fi

# Instala Docker Compose
log_info "Instalando Docker Compose..."
COMPOSE_VERSION="2.24.5"
curl -L "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Cria link simbólico para facilitar uso
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verifica instalação do Docker Compose
if docker-compose --version > /dev/null 2>&1; then
    log_success "Docker Compose instalado com sucesso: $(docker-compose --version)"
else
    log_error "Falha na instalação do Docker Compose"
    exit 1
fi

# Adiciona usuário atual ao grupo docker (se não for root)
if [ "$SUDO_USER" ]; then
    log_info "Adicionando usuário $SUDO_USER ao grupo docker..."
    usermod -aG docker $SUDO_USER
    log_warning "O usuário $SUDO_USER precisa fazer logout e login novamente para usar Docker sem sudo"
fi

# Configura o Docker para iniciar automaticamente
log_info "Configurando Docker para iniciar automaticamente..."
systemctl enable docker

# Testa a instalação
log_info "Testando instalação..."
if docker run hello-world > /dev/null 2>&1; then
    log_success "Docker está funcionando corretamente!"
else
    log_warning "Docker foi instalado mas pode ter problemas na execução"
fi

# Limpa imagem de teste
docker rmi hello-world > /dev/null 2>&1 || true

log_success "🎉 Instalação concluída!"
echo ""
log_info "Próximos passos:"
echo "  1. Se você não é root, faça logout e login novamente"
echo "  2. Execute: chmod +x deploy.sh"
echo "  3. Configure o arquivo .env.production"
echo "  4. Execute: ./deploy.sh"
echo ""
log_info "Comandos úteis:"
echo "  • Verificar status: systemctl status docker"
echo "  • Ver versão: docker --version && docker-compose --version"
echo "  • Testar: docker run hello-world"
