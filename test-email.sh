#!/bin/bash

# Script para testar envio de emails após deploy
# Pode ser executado standalone ou integrado ao deploy

set -e

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

DOCKER_COMPOSE="docker-compose -f docker-compose.centos7.yml"

echo "📧 TESTE DE ENVIO DE EMAILS"
echo "==========================="

# Verificar se container está rodando
if ! docker ps | grep -q "moburb-concurso-centos7"; then
    log_error "Container não está rodando"
    log_info "Execute primeiro: ./deploy-centos7.sh"
    exit 1
fi

# Aguardar aplicação estar pronta
log_info "Aguardando aplicação estar pronta..."
for i in {1..30}; do
    if curl -f http://localhost:3500/api/health >/dev/null 2>&1; then
        log_success "Aplicação respondendo"
        break
    else
        if [ $i -eq 30 ]; then
            log_error "Aplicação não respondeu após 30 tentativas"
            exit 1
        fi
        sleep 2
    fi
done

# Teste 1: Verificar configuração do transporter
log_info "🔍 TESTE 1: Verificando configuração do email..."
$DOCKER_COMPOSE exec -T moburb-app node -e "
const { transporter } = require('./lib/nodemailer.ts');
if (transporter) {
    console.log('✅ Transporter configurado com sucesso');
    console.log('Tipo:', transporter.transporter ? 'SMTP' : 'Sendmail');
} else {
    console.log('❌ Transporter não configurado');
    process.exit(1);
}
" && log_success "Configuração OK" || log_error "Configuração com problemas"

# Teste 2: Verificar sendmail no container
log_info "🔍 TESTE 2: Verificando sendmail no container..."
if $DOCKER_COMPOSE exec -T moburb-app test -f /usr/sbin/sendmail; then
    log_success "Sendmail encontrado no container"
    $DOCKER_COMPOSE exec -T moburb-app ls -la /usr/sbin/sendmail
else
    log_warning "Sendmail não encontrado - usando fallback SMTP"
fi

# Teste 3: API de teste de email
log_info "🔍 TESTE 3: Testando API de envio de email..."

# Dados do teste
EMAIL_TESTE=${1:-"admin@localhost"}
log_info "Enviando email de teste para: $EMAIL_TESTE"

# Fazer requisição para API de teste simplificada
RESPONSE=$(curl -s -X POST http://localhost:3500/api/email-teste-simples \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$EMAIL_TESTE\",
    \"subject\": \"[TESTE] Deploy Mobiliário Urbano - $(date)\",
    \"message\": \"Este é um email de teste enviado durante o deploy. Se você está recebendo este email, o sistema está funcionando corretamente.\"
  }" 2>/dev/null)

# Verificar resposta
if echo "$RESPONSE" | grep -q "success.*true"; then
    log_success "✅ Email de teste enviado com sucesso!"
    echo "Resposta: $RESPONSE"
else
    log_error "❌ Falha no envio do email de teste"
    echo "Resposta: $RESPONSE"
    
    # Verificar logs para mais detalhes
    log_info "Verificando logs da aplicação..."
    $DOCKER_COMPOSE logs --tail=20 moburb-app | grep -i -E "(error|mail|smtp|sendmail)" || echo "Nenhum log específico encontrado"
fi

# Teste 4: Verificar logs do sistema de email
log_info "🔍 TESTE 4: Verificando logs do sistema..."

# Logs da aplicação
echo "📄 Logs da aplicação (últimas 10 linhas com email):"
$DOCKER_COMPOSE logs moburb-app | grep -i -E "(mail|smtp|sendmail)" | tail -10 || echo "Nenhum log de email encontrado"

# Logs do sendmail no host (se disponível)
if [ -f "/var/log/maillog" ]; then
    echo ""
    echo "📄 Logs do sendmail no host (últimas 5 linhas):"
    sudo tail -5 /var/log/maillog 2>/dev/null || echo "Não foi possível ler logs do sendmail"
fi

echo ""
echo "📊 RESUMO DOS TESTES:"
echo "===================="

# Resumo baseado nos testes
if $DOCKER_COMPOSE exec -T moburb-app test -f /usr/sbin/sendmail >/dev/null 2>&1; then
    echo "✅ Sendmail: Disponível no container"
else
    echo "⚠️ Sendmail: Não disponível (usando SMTP)"
fi

if echo "$RESPONSE" | grep -q "success.*true" 2>/dev/null; then
    echo "✅ Teste de envio: Sucesso"
    echo ""
    echo "🎉 SISTEMA DE EMAIL FUNCIONANDO!"
    echo ""
    echo "📧 Para testar com seu email:"
    echo "   $0 seu-email@exemplo.com"
else
    echo "❌ Teste de envio: Falhou"
    echo ""
    echo "🔧 PRÓXIMOS PASSOS:"
    echo "   1. Verificar configuração SMTP no .env.production"
    echo "   2. Verificar se sendmail está instalado: ./check-sendmail.sh"
    echo "   3. Instalar sendmail se necessário: sudo ./install-sendmail-centos7.sh"
    echo "   4. Verificar logs: docker-compose -f docker-compose.centos7.yml logs moburb-app"
fi

echo ""
echo "📋 Comandos úteis:"
echo "   • Logs: $DOCKER_COMPOSE logs -f moburb-app | grep -i mail"
echo "   • Status: $DOCKER_COMPOSE ps"
echo "   • Restart: $DOCKER_COMPOSE restart moburb-app"
