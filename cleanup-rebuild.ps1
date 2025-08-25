# Script PowerShell para limpeza completa e rebuild
# Resolve problemas de cache de Docker com entrypoint antigo

param(
    [switch]$Force
)

# Função para escrever mensagens coloridas
function Write-Info($Message) {
    Write-Host $Message -ForegroundColor Cyan
}

function Write-Success($Message) {
    Write-Host $Message -ForegroundColor Green
}

function Write-Error($Message) {
    Write-Host $Message -ForegroundColor Red
}

function Write-Warning($Message) {
    Write-Host $Message -ForegroundColor Yellow
}

Write-Info "🧹 Iniciando limpeza completa do Docker..."

# Verifica se Docker está rodando
try {
    docker version | Out-Null
} catch {
    Write-Error "❌ Docker não está rodando. Inicie o Docker Desktop e tente novamente."
    exit 1
}

# Para todos os containers do projeto
Write-Info "📦 Parando e removendo containers..."
try {
    & docker-compose down -v --remove-orphans 2>$null
} catch {
    Write-Warning "⚠️ Alguns containers podem não existir (normal)"
}

# Remove containers por nome específico
Write-Info "🗑️ Removendo containers específicos..."
@("moburb-concurso", "moburb-app") | ForEach-Object {
    try {
        docker rm -f $_ 2>$null
        Write-Success "✅ Container $_ removido"
    } catch {
        Write-Warning "⚠️ Container $_ não encontrado (normal)"
    }
}

# Remove imagens relacionadas ao projeto
Write-Info "🖼️ Removendo imagens antigas..."
try {
    $images = docker images --format "table {{.Repository}}:{{.Tag}}`t{{.ID}}" | Where-Object { $_ -match "(moburb|mobiliario)" }
    if ($images) {
        $imageIds = $images | ForEach-Object { ($_ -split "`t")[1] } | Where-Object { $_ -ne "IMAGE" }
        if ($imageIds) {
            docker rmi -f $imageIds 2>$null
            Write-Success "✅ Imagens antigas removidas"
        }
    } else {
        Write-Info "📷 Nenhuma imagem antiga encontrada"
    }
} catch {
    Write-Warning "⚠️ Erro ao remover algumas imagens (pode ser normal)"
}

# Limpeza geral do Docker
Write-Info "🧽 Limpando cache do Docker..."
try {
    docker system prune -f 2>$null
    docker builder prune -f 2>$null
    Write-Success "✅ Cache limpo"
} catch {
    Write-Warning "⚠️ Erro na limpeza de cache"
}

# Rebuild completo
Write-Info "🔨 Fazendo rebuild completo sem cache..."
Write-Warning "⏰ Isso pode demorar alguns minutos..."

try {
    & docker-compose build --no-cache --pull
    Write-Success "✅ Rebuild concluído com sucesso!"
} catch {
    Write-Error "❌ Erro durante o rebuild"
    Write-Error $_.Exception.Message
    exit 1
}

# Verifica a nova imagem
Write-Info "🔍 Verificando nova imagem..."
try {
    $newImage = docker images --format "table {{.Repository}}:{{.Tag}}`t{{.ID}}" | Where-Object { $_ -match "mobiliario" } | Select-Object -First 1
    if ($newImage) {
        $imageId = ($newImage -split "`t")[1]
        Write-Success "✅ Nova imagem criada: $imageId"
        
        # Verifica configuração da imagem
        Write-Info "🔍 Verificando configuração da imagem..."
        $imageConfig = docker inspect $imageId | ConvertFrom-Json
        $entrypoint = $imageConfig[0].Config.Entrypoint
        $cmd = $imageConfig[0].Config.Cmd
        
        Write-Info "📋 Configuração da imagem:"
        Write-Host "   Entrypoint: $($entrypoint -join ' ')" -ForegroundColor Gray
        Write-Host "   CMD: $($cmd -join ' ')" -ForegroundColor Gray
        
        if ($entrypoint -and $entrypoint -contains "docker-entrypoint.sh") {
            Write-Error "❌ PROBLEMA: Imagem ainda contém entrypoint indesejado!"
            Write-Error "   Isso indica que o cache não foi limpo corretamente."
            Write-Info "💡 Tente executar novamente com -Force"
        } else {
            Write-Success "✅ Entrypoint removido com sucesso!"
        }
    } else {
        Write-Error "❌ Nova imagem não encontrada"
        exit 1
    }
} catch {
    Write-Warning "⚠️ Não foi possível verificar a imagem"
}

Write-Host ""
Write-Success "✅ Limpeza e rebuild concluídos!"
Write-Info "🚀 Agora execute: docker-compose up -d"
Write-Host ""
Write-Info "📊 Para monitorar:"
Write-Host "   docker-compose logs -f moburb-app" -ForegroundColor Gray
Write-Host ""

# Pergunta se deve iniciar automaticamente
$startNow = Read-Host "Deseja iniciar os containers agora? (y/N)"
if ($startNow -eq "y" -or $startNow -eq "Y") {
    Write-Info "🚀 Iniciando containers..."
    try {
        & docker-compose up -d
        Write-Success "✅ Containers iniciados!"
        Write-Info "📋 Aguarde alguns segundos e verifique os logs:"
        Write-Host "   docker-compose logs -f moburb-app" -ForegroundColor Gray
    } catch {
        Write-Error "❌ Erro ao iniciar containers"
        Write-Error $_.Exception.Message
    }
}
