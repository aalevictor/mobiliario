#!/bin/bash

# Script para verificar configuração do sendmail no CentOS 7

echo "🔍 VERIFICAÇÃO DO SENDMAIL NO CENTOS 7"
echo "====================================="

# Verificar se sendmail está instalado
echo "📦 Verificando instalação do sendmail..."
if command -v sendmail &> /dev/null; then
    echo "✅ Sendmail encontrado: $(which sendmail)"
    ls -la $(which sendmail)
else
    echo "❌ Sendmail não encontrado"
    echo "💡 Instale com: sudo yum install sendmail sendmail-cf"
fi

# Verificar se serviço está rodando
echo ""
echo "🔄 Verificando serviço sendmail..."
systemctl is-active sendmail 2>/dev/null && echo "✅ Serviço ativo" || echo "❌ Serviço não ativo"
systemctl is-enabled sendmail 2>/dev/null && echo "✅ Serviço habilitado" || echo "❌ Serviço não habilitado"

# Verificar configurações de mail
echo ""
echo "📧 Verificando configurações de mail..."
if [ -d "/etc/mail" ]; then
    echo "✅ Diretório /etc/mail existe"
    ls -la /etc/mail/ | head -10
else
    echo "❌ Diretório /etc/mail não encontrado"
fi

# Verificar logs de mail
echo ""
echo "📄 Verificando logs de mail..."
if [ -f "/var/log/maillog" ]; then
    echo "✅ Log de mail encontrado"
    echo "Últimas 5 linhas:"
    tail -5 /var/log/maillog 2>/dev/null || echo "Erro ao ler log"
else
    echo "❌ Log de mail não encontrado"
fi

# Teste básico do sendmail
echo ""
echo "🧪 Testando sendmail básico..."
if command -v sendmail &> /dev/null; then
    echo "test" | sendmail -t -oi -f test@localhost test@localhost &>/dev/null && echo "✅ Teste básico passou" || echo "❌ Teste básico falhou"
else
    echo "❌ Não é possível testar - sendmail não instalado"
fi

echo ""
echo "🎯 RESUMO:"
echo "========="
if command -v sendmail &> /dev/null; then
    if systemctl is-active sendmail &>/dev/null; then
        echo "✅ Sendmail configurado e funcionando"
        echo "💡 Problema pode ser no volume mount do Docker"
    else
        echo "⚠️ Sendmail instalado mas serviço não está ativo"
        echo "💡 Execute: sudo systemctl start sendmail && sudo systemctl enable sendmail"
    fi
else
    echo "❌ Sendmail não está instalado"
    echo "💡 Execute: sudo yum install sendmail sendmail-cf"
    echo "💡 Depois: sudo systemctl start sendmail && sudo systemctl enable sendmail"
fi
