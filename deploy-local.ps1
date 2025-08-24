# Script de Deploy Local para Windows
# Concurso de Mobiliário Urbano - SPURBANISMO

param(
    [switch]$Clean = $false,
    [switch]$Rebuild = $false
)

# Função para log colorido
function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Info "🚀 Iniciando deploy local da aplicação Mobiliário Urbano..."

# Verifica se Docker está rodando
try {
    docker info | Out-Null
    Write-Success "Docker está rodando"
} catch {
    Write-Error "Docker não está rodando. Inicie o Docker Desktop."
    exit 1
}

# Verifica se docker-compose está disponível
try {
    docker-compose --version | Out-Null
    $dockerCompose = "docker-compose"
    Write-Info "Usando docker-compose"
} catch {
    try {
        docker compose version | Out-Null
        $dockerCompose = "docker compose"
        Write-Info "Usando docker compose"
    } catch {
        Write-Error "Docker Compose não está disponível"
        exit 1
    }
}

# Cria diretórios necessários
Write-Info "Criando diretórios necessários..."
New-Item -Path "uploads" -ItemType Directory -Force | Out-Null
New-Item -Path "logs" -ItemType Directory -Force | Out-Null

# Verifica se arquivo .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Warning "Arquivo .env.local não encontrado."
    if (Test-Path "env.local.example") {
        Write-Info "Criando .env.local baseado no exemplo..."
        Copy-Item "env.local.example" ".env.local"
        Write-Success ".env.local criado com sucesso!"
    } else {
        Write-Error "Arquivo env.local.example não encontrado!"
        exit 1
    }
}

# Para containers se Clean foi especificado
if ($Clean) {
    Write-Info "Parando e removendo containers existentes..."
    & $dockerCompose -f docker-compose.local.yml down --volumes --remove-orphans
    
    # Remove imagens se Rebuild foi especificado
    if ($Rebuild) {
        Write-Info "Removendo imagens para rebuild..."
        docker rmi mobiliario_moburb-app:latest -f 2>$null
        docker rmi mobiliario_moburb-app-local:latest -f 2>$null
    }
}

# Para containers existentes
Write-Info "Parando containers existentes..."
& $dockerCompose -f docker-compose.local.yml down

# Faz o build da aplicação
if ($Rebuild) {
    Write-Info "Construindo imagens Docker (rebuild)..."
    & $dockerCompose -f docker-compose.local.yml build --no-cache
} else {
    Write-Info "Construindo imagens Docker..."
    & $dockerCompose -f docker-compose.local.yml build
}

# Inicia os containers
Write-Info "Iniciando containers..."
& $dockerCompose -f docker-compose.local.yml up -d

# Executa seed do banco de dados
Write-Info "Executando seed do banco de dados..."
& $dockerCompose -f docker-compose.local.yml exec moburb-app npm run seed

# Aguarda os containers ficarem saudáveis
Write-Info "Aguardando containers inicializarem..."
Start-Sleep -Seconds 15

# Verifica se os containers estão rodando
$containers = & $dockerCompose -f docker-compose.local.yml ps --services --filter "status=running"

if ($containers -contains "mysql-local" -and $containers -contains "moburb-app") {
    Write-Success "Containers iniciados com sucesso!"
} else {
    Write-Error "Falha ao iniciar containers"
    Write-Info "Verificando logs..."
    & $dockerCompose -f docker-compose.local.yml logs --tail=50
    exit 1
}

# Testa o health check
Write-Info "Testando aplicação..."
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3500/api/health" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Aplicação está saudável! ✅"
            break
        }
    } catch {
        # Ignora erro e continua tentando
    }
    
    if ($attempt -eq $maxAttempts) {
        Write-Error "Aplicação não respondeu ao health check após $maxAttempts tentativas"
        Write-Info "Verificando logs..."
        & $dockerCompose -f docker-compose.local.yml logs --tail=50 moburb-app
        exit 1
    }
    
    Write-Info "Aguardando aplicação... (tentativa $attempt/$maxAttempts)"
    Start-Sleep -Seconds 2
} while ($attempt -lt $maxAttempts)

# Mostra informações finais
Write-Success "🎉 Deploy local concluído com sucesso!"
Write-Host ""
Write-Info "Informações do deploy local:"
Write-Host "  • Aplicação: http://localhost:3500" -ForegroundColor Cyan
Write-Host "  • Health Check: http://localhost:3500/api/health" -ForegroundColor Cyan
Write-Host "  • Adminer (DB): http://localhost:8080" -ForegroundColor Cyan
Write-Host "    - Servidor: mysql-local" -ForegroundColor Gray
Write-Host "    - Usuário: moburb_user" -ForegroundColor Gray
Write-Host "    - Senha: moburb123" -ForegroundColor Gray
Write-Host "    - Banco: moburb_local" -ForegroundColor Gray
Write-Host "    - Porta externa: 3307 (evita conflito com MySQL local)" -ForegroundColor Gray
Write-Host ""
Write-Info "Comandos úteis:"
Write-Host "  • Ver logs: $dockerCompose -f docker-compose.local.yml logs -f"
Write-Host "  • Parar: $dockerCompose -f docker-compose.local.yml down"
Write-Host "  • Reiniciar: $dockerCompose -f docker-compose.local.yml restart"
Write-Host "  • Status: $dockerCompose -f docker-compose.local.yml ps"
Write-Host ""
Write-Info "Para gerenciar:"
Write-Host "  • .\manage-local.ps1 -Status"
Write-Host "  • .\manage-local.ps1 -Logs"
Write-Host "  • .\manage-local.ps1 -Stop"
