# Script de Gerenciamento Local para Windows
# Concurso de Mobiliário Urbano - SPURBANISMO

param(
    [switch]$Start,
    [switch]$Stop,
    [switch]$Restart,
    [switch]$Status,
    [switch]$Logs,
    [switch]$LogsFollow,
    [switch]$Health,
    [switch]$Shell,
    [switch]$Stats,
    [switch]$Cleanup,
    [switch]$Help
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

# Detecta comando do Docker Compose
try {
    docker-compose --version | Out-Null
    $dockerCompose = "docker-compose"
} catch {
    try {
        docker compose version | Out-Null
        $dockerCompose = "docker compose"
    } catch {
        Write-Error "Docker Compose não está disponível"
        exit 1
    }
}

function Show-Help {
    Write-Host "Script de Gerenciamento Local - Concurso Mobiliário Urbano" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\manage-local.ps1 [COMANDO]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponíveis:" -ForegroundColor Green
    Write-Host "  -Start           Inicia a aplicação"
    Write-Host "  -Stop            Para a aplicação"
    Write-Host "  -Restart         Reinicia a aplicação"
    Write-Host "  -Status          Mostra status dos containers"
    Write-Host "  -Logs            Mostra logs da aplicação"
    Write-Host "  -LogsFollow      Segue logs em tempo real"
    Write-Host "  -Health          Verifica saúde da aplicação"
    Write-Host "  -Shell           Acessa shell do container"
    Write-Host "  -Stats           Mostra estatísticas de uso"
    Write-Host "  -Cleanup         Remove containers e imagens antigas"
    Write-Host "  -Help            Mostra esta ajuda"
    Write-Host ""
}

function Start-App {
    Write-Info "Iniciando aplicação local..."
    & $dockerCompose -f docker-compose.local.yml up -d
    Start-Sleep -Seconds 5
    Test-Health
}

function Stop-App {
    Write-Info "Parando aplicação local..."
    & $dockerCompose -f docker-compose.local.yml down
    Write-Success "Aplicação parada"
}

function Restart-App {
    Write-Info "Reiniciando aplicação local..."
    & $dockerCompose -f docker-compose.local.yml restart
    Start-Sleep -Seconds 5
    Test-Health
}

function Show-Status {
    Write-Info "Status dos containers:"
    & $dockerCompose -f docker-compose.local.yml ps
    Write-Host ""
    Write-Info "Uso de recursos:"
    try {
        docker stats --no-stream moburb-app-local 2>$null
    } catch {
        Write-Warning "Container não está rodando"
    }
}

function Show-Logs {
    Write-Info "Logs da aplicação (últimas 100 linhas):"
    & $dockerCompose -f docker-compose.local.yml logs --tail=100
}

function Follow-Logs {
    Write-Info "Seguindo logs em tempo real (Ctrl+C para sair):"
    & $dockerCompose -f docker-compose.local.yml logs -f
}

function Test-Health {
    Write-Info "Verificando saúde da aplicação..."
    
    $containers = & $dockerCompose -f docker-compose.local.yml ps --services --filter "status=running"
    
    if (-not ($containers -contains "moburb-app")) {
        Write-Error "Container da aplicação não está rodando"
        return $false
    }
    
    $maxAttempts = 10
    $attempt = 0
    
    do {
        $attempt++
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3500/api/health" -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Success "Aplicação está saudável! ✅"
                return $true
            }
        } catch {
            # Ignora erro e continua tentando
        }
        
        if ($attempt -eq $maxAttempts) {
            Write-Error "Aplicação não responde ao health check ❌"
            Write-Info "Verificando logs recentes:"
            & $dockerCompose -f docker-compose.local.yml logs --tail=20 moburb-app
            return $false
        }
        
        Write-Info "Aguardando resposta... (tentativa $attempt/$maxAttempts)"
        Start-Sleep -Seconds 2
    } while ($attempt -lt $maxAttempts)
}

function Access-Shell {
    Write-Info "Acessando shell do container..."
    & $dockerCompose -f docker-compose.local.yml exec moburb-app /bin/sh
}

function Show-Stats {
    Write-Info "Estatísticas detalhadas:"
    Write-Host ""
    
    # Status do container
    $containers = & $dockerCompose -f docker-compose.local.yml ps --services --filter "status=running"
    
    if ($containers -contains "moburb-app") {
        Write-Success "Container Status: RODANDO ✅"
        
        # Uso de recursos
        Write-Host ""
        Write-Info "Uso de Recursos:"
        docker stats --no-stream --format "table {{.Name}}`t{{.CPUPerc}}`t{{.MemUsage}}`t{{.MemPerc}}`t{{.NetIO}}`t{{.BlockIO}}" moburb-app-local
        
        # Health check
        Write-Host ""
        Test-Health | Out-Null
        
        # URLs importantes
        Write-Host ""
        Write-Info "URLs da Aplicação:"
        Write-Host "  • App: http://localhost:3500" -ForegroundColor Cyan
        Write-Host "  • Health: http://localhost:3500/api/health" -ForegroundColor Cyan
        Write-Host "  • Adminer: http://localhost:8080" -ForegroundColor Cyan
        
    } else {
        Write-Error "Container Status: PARADO ❌"
    }
    
    # Espaço em disco
    Write-Host ""
    Write-Info "Espaço em Disco:"
    $drive = Get-PSDrive -Name ($PWD.Drive.Name)
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    $totalGB = [math]::Round(($drive.Free + $drive.Used) / 1GB, 2)
    Write-Host "  Livre: $freeGB GB / Total: $totalGB GB"
    
    # Tamanho dos diretórios
    Write-Host ""
    Write-Info "Tamanho dos Diretórios:"
    if (Test-Path "uploads") {
        $uploadsSize = [math]::Round((Get-ChildItem "uploads" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
        Write-Host "  uploads: $uploadsSize MB"
    }
    if (Test-Path "logs") {
        $logsSize = [math]::Round((Get-ChildItem "logs" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
        Write-Host "  logs: $logsSize MB"
    }
}

function Cleanup {
    Write-Info "Limpando containers e imagens locais..."
    
    # Para todos os containers
    & $dockerCompose -f docker-compose.local.yml down --volumes --remove-orphans
    
    # Remove imagens relacionadas
    docker rmi mobiliario_moburb-app-local -f 2>$null
    docker rmi mobiliario_mysql-local -f 2>$null
    
    # Remove imagens não utilizadas
    docker image prune -f
    
    # Remove volumes não utilizados
    docker volume prune -f
    
    Write-Success "Limpeza concluída"
}

# Verifica se foi passado algum parâmetro
$hasCommand = $Start -or $Stop -or $Restart -or $Status -or $Logs -or $LogsFollow -or $Health -or $Shell -or $Stats -or $Cleanup -or $Help

if (-not $hasCommand) {
    Show-Help
    exit 0
}

# Executa comando baseado no parâmetro
if ($Start) { Start-App }
elseif ($Stop) { Stop-App }
elseif ($Restart) { Restart-App }
elseif ($Status) { Show-Status }
elseif ($Logs) { Show-Logs }
elseif ($LogsFollow) { Follow-Logs }
elseif ($Health) { Test-Health | Out-Null }
elseif ($Shell) { Access-Shell }
elseif ($Stats) { Show-Stats }
elseif ($Cleanup) { Cleanup }
elseif ($Help) { Show-Help }
