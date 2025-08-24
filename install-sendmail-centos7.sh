#!/bin/bash

# Script para instalar e configurar sendmail no CentOS 7

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

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   log_error "Este script deve ser executado como root"
   exit 1
fi

echo "📧 INSTALAÇÃO E CONFIGURAÇÃO DO SENDMAIL - CENTOS 7"
echo "=================================================="

# Atualizar sistema
log_info "Atualizando sistema..."
yum update -y

# Instalar sendmail e dependências
log_info "Instalando sendmail e dependências..."
yum install -y sendmail sendmail-cf m4

# Verificar instalação
if command -v sendmail &> /dev/null; then
    log_success "Sendmail instalado com sucesso: $(which sendmail)"
    ls -la $(which sendmail)
else
    log_error "Falha na instalação do sendmail"
    exit 1
fi

# Configurar sendmail básico
log_info "Configurando sendmail..."

# Backup da configuração original
if [ -f "/etc/mail/sendmail.mc" ]; then
    cp /etc/mail/sendmail.mc /etc/mail/sendmail.mc.backup
    log_info "Backup da configuração criado"
fi

# Configuração básica para aceitar conexões locais
cat > /etc/mail/sendmail.mc << 'EOF'
include(`/usr/share/sendmail-cf/m4/cf.m4')dnl
VERSIONID(`setup for CentOS Linux')dnl
OSTYPE(`linux')dnl
define(`confDEF_USER_ID', ``8:12'')dnl
undefine(`UUCP_RELAY')dnl
undefine(`BITNET_RELAY')dnl
define(`confAUTO_REBUILD')dnl
define(`confTO_CONNECT', `1m')dnl
define(`confTRY_NULL_MX_LIST', `True')dnl
define(`confDONT_PROBE_INTERFACES', `True')dnl
define(`PROCMAIL_MAILER_PATH', `/usr/bin/procmail')dnl
define(`ALIAS_FILE', `/etc/aliases')dnl
define(`STATUS_FILE', `/var/log/mail/statistics')dnl
define(`UUCP_MAILER_MAX', `2000000')dnl
define(`confUSERDB_SPEC', `/etc/mail/userdb.db')dnl
define(`confPRIVACY_FLAGS', `authwarnings,novrfy,noexpn,restrictqrun')dnl
define(`confAUTH_OPTIONS', `A')dnl
define(`confTO_IDENT', `0')dnl
FEATURE(delay_checks)dnl
FEATURE(`no_default_msa', `dnl')dnl
FEATURE(`smrsh', `/usr/sbin/smrsh')dnl
FEATURE(`mailertable', `hash -o /etc/mail/mailertable.db')dnl
FEATURE(`virtusertable', `hash -o /etc/mail/virtusertable.db')dnl
FEATURE(redirect)dnl
FEATURE(always_add_domain)dnl
FEATURE(use_cw_file)dnl
FEATURE(use_ct_file)dnl
FEATURE(local_procmail, `', `procmail -t -Y -a $h -d $u')dnl
FEATURE(`access_db', `hash -T<TMPF> -o /etc/mail/access.db')dnl
FEATURE(`blacklist_recipients')dnl
EXPOSED_USER(`root')dnl
DAEMON_OPTIONS(`Port=smtp,Addr=127.0.0.1, Name=MTA')dnl
FEATURE(`accept_unresolvable_domains')dnl
FEATURE(`accept_unqualified_senders')dnl
LOCAL_DOMAIN(`localhost.localdomain')dnl
MAILER(smtp)dnl
MAILER(procmail)dnl
EOF

# Gerar nova configuração
log_info "Gerando nova configuração..."
cd /etc/mail
m4 sendmail.mc > sendmail.cf

# Configurar aliases
log_info "Configurando aliases..."
if ! grep -q "root:" /etc/aliases; then
    echo "root: root@localhost" >> /etc/aliases
fi
newaliases

# Configurar firewall para permitir SMTP local
log_info "Configurando firewall..."
if systemctl is-active firewalld &>/dev/null; then
    firewall-cmd --permanent --add-service=smtp
    firewall-cmd --reload
    log_info "Firewall configurado"
fi

# Iniciar e habilitar serviços
log_info "Iniciando serviços..."
systemctl enable sendmail
systemctl start sendmail

# Verificar status
if systemctl is-active sendmail &>/dev/null; then
    log_success "✅ Sendmail iniciado e funcionando"
else
    log_error "❌ Falha ao iniciar sendmail"
    systemctl status sendmail
    exit 1
fi

# Teste básico
log_info "Executando teste básico..."
echo "Teste de configuração do sendmail" | sendmail -v root@localhost && log_success "✅ Teste básico passou" || log_warning "⚠️ Teste básico falhou"

# Verificar logs
log_info "Verificando logs..."
if [ -f "/var/log/maillog" ]; then
    echo "Últimas linhas do log:"
    tail -5 /var/log/maillog
fi

echo ""
log_success "🎉 INSTALAÇÃO CONCLUÍDA!"
echo "========================"
echo "✅ Sendmail instalado e configurado"
echo "✅ Serviço iniciado e habilitado"
echo "✅ Configuração básica aplicada"
echo ""
echo "📋 Informações:"
echo "   • Path: $(which sendmail)"
echo "   • Config: /etc/mail/sendmail.cf"
echo "   • Logs: /var/log/maillog"
echo "   • Status: systemctl status sendmail"
echo ""
echo "🔄 Próximo passo: Execute deploy da aplicação"
echo "   ./deploy-centos7.sh"
