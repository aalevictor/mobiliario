#!/bin/bash

# Script para limpeza COMPLETA do Docker
# Remove TODOS os containers, imagens, volumes e redes

set -e

echo "🧹 LIMPEZA COMPLETA DO DOCKER - TODOS OS DADOS SERÃO REMOVIDOS!"
echo "⚠️  Pressione CTRL+C para cancelar ou aguarde 5 segundos..."

sleep 5

echo "🚀 Iniciando limpeza completa..."

# Para todos os containers
echo "🛑 Parando todos os containers..."
RUNNING_CONTAINERS=$(docker ps -q)
if [ -n "$RUNNING_CONTAINERS" ]; then
    docker stop $RUNNING_CONTAINERS
    echo "✅ Containers parados"
else
    echo "ℹ️  Nenhum container em execução"
fi

# Remove todos os containers
echo "🗑️ Removendo todos os containers..."
ALL_CONTAINERS=$(docker ps -aq)
if [ -n "$ALL_CONTAINERS" ]; then
    docker rm -f $ALL_CONTAINERS
    echo "✅ Containers removidos"
else
    echo "ℹ️  Nenhum container para remover"
fi

# Remove todas as imagens
echo "🖼️ Removendo todas as imagens..."
ALL_IMAGES=$(docker images -q)
if [ -n "$ALL_IMAGES" ]; then
    docker rmi -f $ALL_IMAGES
    echo "✅ Imagens removidas"
else
    echo "ℹ️  Nenhuma imagem para remover"
fi

# Remove todos os volumes
echo "💾 Removendo todos os volumes..."
ALL_VOLUMES=$(docker volume ls -q)
if [ -n "$ALL_VOLUMES" ]; then
    docker volume rm $ALL_VOLUMES 2>/dev/null || true
    echo "✅ Volumes removidos"
else
    echo "ℹ️  Nenhum volume para remover"
fi

# Remove todas as redes customizadas
echo "🌐 Removendo redes customizadas..."
CUSTOM_NETWORKS=$(docker network ls -q --filter type=custom)
if [ -n "$CUSTOM_NETWORKS" ]; then
    docker network rm $CUSTOM_NETWORKS 2>/dev/null || true
    echo "✅ Redes removidas"
else
    echo "ℹ️  Nenhuma rede customizada para remover"
fi

# Limpeza final do sistema
echo "🧽 Executando limpeza final do sistema..."
docker system prune -a -f --volumes
docker builder prune -a -f

echo ""
echo "✅ LIMPEZA COMPLETA CONCLUÍDA!"
echo "🔍 Verificando estado atual do Docker:"

echo ""
echo "📊 Containers:"
docker ps -a

echo ""
echo "🖼️ Imagens:"
docker images

echo ""
echo "💾 Volumes:"
docker volume ls

echo ""
echo "🌐 Redes:"
docker network ls

echo ""
echo "💿 Uso de disco Docker:"
docker system df
