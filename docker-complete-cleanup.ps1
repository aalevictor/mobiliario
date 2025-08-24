#!/usr/bin/env powershell

# Script para limpeza COMPLETA do Docker
# Remove TODOS os containers, imagens, volumes e redes

Write-Host "🧹 LIMPEZA COMPLETA DO DOCKER - TODOS OS DADOS SERÃO REMOVIDOS!" -ForegroundColor Red
Write-Host "⚠️  Pressione CTRL+C para cancelar ou aguarde 5 segundos..." -ForegroundColor Yellow

Start-Sleep -Seconds 5

Write-Host "🚀 Iniciando limpeza completa..." -ForegroundColor Green

# Para todos os containers
Write-Host "🛑 Parando todos os containers..." -ForegroundColor Cyan
try {
    $containers = docker ps -q
    if ($containers) {
        docker stop $containers
        Write-Host "✅ Containers parados" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Nenhum container em execução" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ℹ️  Nenhum container para parar" -ForegroundColor Yellow
}

# Remove todos os containers
Write-Host "🗑️ Removendo todos os containers..." -ForegroundColor Cyan
try {
    $allContainers = docker ps -aq
    if ($allContainers) {
        docker rm -f $allContainers
        Write-Host "✅ Containers removidos" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Nenhum container para remover" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ℹ️  Nenhum container para remover" -ForegroundColor Yellow
}

# Remove todas as imagens
Write-Host "🖼️ Removendo todas as imagens..." -ForegroundColor Cyan
try {
    $allImages = docker images -q
    if ($allImages) {
        docker rmi -f $allImages
        Write-Host "✅ Imagens removidas" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Nenhuma imagem para remover" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ℹ️  Nenhuma imagem para remover" -ForegroundColor Yellow
}

# Remove todos os volumes
Write-Host "💾 Removendo todos os volumes..." -ForegroundColor Cyan
try {
    $allVolumes = docker volume ls -q
    if ($allVolumes) {
        docker volume rm $allVolumes
        Write-Host "✅ Volumes removidos" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Nenhum volume para remover" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ℹ️  Nenhum volume para remover" -ForegroundColor Yellow
}

# Remove todas as redes customizadas
Write-Host "🌐 Removendo redes customizadas..." -ForegroundColor Cyan
try {
    $customNetworks = docker network ls -q --filter type=custom
    if ($customNetworks) {
        docker network rm $customNetworks
        Write-Host "✅ Redes removidas" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Nenhuma rede customizada para remover" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ℹ️  Nenhuma rede para remover" -ForegroundColor Yellow
}

# Limpeza final do sistema
Write-Host "🧽 Executando limpeza final do sistema..." -ForegroundColor Cyan
docker system prune -a -f --volumes
docker builder prune -a -f

Write-Host ""
Write-Host "✅ LIMPEZA COMPLETA CONCLUÍDA!" -ForegroundColor Green
Write-Host "🔍 Verificando estado atual do Docker:" -ForegroundColor Cyan

Write-Host ""
Write-Host "📊 Containers:" -ForegroundColor Yellow
docker ps -a

Write-Host ""
Write-Host "🖼️ Imagens:" -ForegroundColor Yellow
docker images

Write-Host ""
Write-Host "💾 Volumes:" -ForegroundColor Yellow
docker volume ls

Write-Host ""
Write-Host "🌐 Redes:" -ForegroundColor Yellow
docker network ls

Write-Host ""
Write-Host "💿 Uso de disco Docker:" -ForegroundColor Yellow
docker system df
