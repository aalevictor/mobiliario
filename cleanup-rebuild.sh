#!/bin/bash

# Script para limpeza completa e rebuild
# Resolve problemas de cache de Docker com entrypoint antigo

set -e

echo "🧹 Iniciando limpeza completa do Docker..."

# Para todos os containers do projeto
echo "📦 Parando e removendo containers..."
docker-compose down -v --remove-orphans 2>/dev/null || true

# Remove containers por nome específico (caso existam)
docker rm -f moburb-concurso 2>/dev/null || true
docker rm -f moburb-app 2>/dev/null || true

# Remove imagens relacionadas ao projeto
echo "🗑️ Removendo imagens antigas..."
docker images | grep -E "(moburb|mobiliario)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Remove imagens órfãs e cache de build
echo "🧽 Limpando cache do Docker..."
docker system prune -f 2>/dev/null || true
docker builder prune -f 2>/dev/null || true

# Rebuild completo sem cache
echo "🔨 Fazendo rebuild completo sem cache..."
docker-compose build --no-cache --pull

# Verifica se a imagem foi criada corretamente
echo "🔍 Verificando nova imagem..."
IMAGE_ID=$(docker images | grep mobiliario | head -1 | awk '{print $3}')
if [ -n "$IMAGE_ID" ]; then
    echo "✅ Nova imagem criada: $IMAGE_ID"
    
    # Testa a imagem sem entrypoint
    echo "🧪 Testando imagem (deve mostrar apenas npm start)..."
    docker run --rm --entrypoint="" $IMAGE_ID cat /proc/1/cmdline 2>/dev/null || echo "Teste de processo não disponível"
    
    # Verifica se existe entrypoint indesejado
    echo "🔍 Verificando se entrypoint foi removido..."
    ENTRYPOINT_CHECK=$(docker inspect $IMAGE_ID | grep -i entrypoint || echo "Sem entrypoint")
    echo "Resultado: $ENTRYPOINT_CHECK"
else
    echo "❌ Erro: Imagem não foi criada"
    exit 1
fi

echo ""
echo "✅ Limpeza e rebuild concluídos!"
echo "🚀 Agora execute: docker-compose up -d"
echo ""
echo "📊 Para monitorar:"
echo "   docker-compose logs -f moburb-app"
echo ""
