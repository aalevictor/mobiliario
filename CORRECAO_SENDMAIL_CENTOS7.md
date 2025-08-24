# 🔧 Correção: Erro do Sendmail no CentOS 7

## ❌ **Erro:**
```
Error: spawn /usr/sbin/sendmail ENOENT
```

**Causa:** Sendmail não está instalado ou não está acessível no container.

## 🔍 **Diagnóstico Primeiro:**

Execute no servidor CentOS 7:
```bash
chmod +x check-sendmail.sh
./check-sendmail.sh
```

## ✅ **Soluções (3 Opções):**

### **🚀 Opção 1: Instalar Sendmail (Recomendado)**

**No servidor CentOS 7:**
```bash
chmod +x install-sendmail-centos7.sh
sudo ./install-sendmail-centos7.sh
```

**O que faz:**
- ✅ Instala sendmail e dependências
- ✅ Configura sendmail para funcionar localmente
- ✅ Inicia e habilita o serviço
- ✅ Testa a configuração

### **🛠️ Opção 2: Docker Compose Corrigido**

**O docker-compose.centos7.yml foi atualizado com:**
```yaml
volumes:
  # Sendmail mais específico
  - /usr/sbin/sendmail:/usr/sbin/sendmail:ro
  - /usr/lib/sendmail:/usr/lib/sendmail:ro
  # Bibliotecas necessárias
  - /lib64:/lib64:ro
  - /usr/lib64:/usr/lib64:ro
```

### **🔄 Opção 3: Fallback Automático para SMTP**

**O nodemailer foi atualizado para:**
- ✅ Tentar sendmail primeiro
- ✅ Fallback automático para SMTP se sendmail falhar
- ✅ Logs informativos sobre qual método está sendo usado

## 📋 **Sequência de Correção:**

### **1. Verificar Estado Atual:**
```bash
./check-sendmail.sh
```

### **2. Se Sendmail NÃO estiver instalado:**
```bash
sudo ./install-sendmail-centos7.sh
```

### **3. Se Sendmail estiver instalado mas não funcionando:**
```bash
# Verificar se serviço está ativo
sudo systemctl status sendmail

# Se não estiver ativo
sudo systemctl start sendmail
sudo systemctl enable sendmail
```

### **4. Redeploy da Aplicação:**
```bash
./deploy-centos7.sh
```

### **5. Testar Email:**
```bash
# Verificar logs da aplicação
docker-compose -f docker-compose.centos7.yml logs moburb-app | grep -i mail

# Teste manual no container
docker-compose -f docker-compose.centos7.yml exec moburb-app ls -la /usr/sbin/sendmail
```

## 🎯 **Configuração de Fallback SMTP (Opcional):**

Se preferir usar SMTP ao invés de sendmail, adicione no `.env.production`:

```env
# Configuração SMTP como fallback
MAIL_HOST="smtp.gmail.com"
MAIL_PORT="587"
MAIL_USER="seu-email@gmail.com"
MAIL_PASS="sua-senha-app"
```

## 🔍 **Troubleshooting:**

### **Se ainda der erro:**

1. **Verificar permissões:**
   ```bash
   ls -la /usr/sbin/sendmail
   sudo chmod +x /usr/sbin/sendmail
   ```

2. **Verificar logs do sistema:**
   ```bash
   sudo tail -f /var/log/maillog
   sudo journalctl -u sendmail -f
   ```

3. **Teste manual:**
   ```bash
   echo "teste" | /usr/sbin/sendmail -t -oi test@localhost
   ```

4. **Verificar SELinux:**
   ```bash
   sudo getenforce
   # Se for Enforcing, pode estar bloqueando
   sudo setsebool -P httpd_can_sendmail 1
   ```

## 📊 **Verificação Final:**

### **1. Sendmail funcionando:**
```bash
systemctl is-active sendmail
which sendmail
```

### **2. Container vê o sendmail:**
```bash
docker-compose -f docker-compose.centos7.yml exec moburb-app which sendmail
docker-compose -f docker-compose.centos7.yml exec moburb-app ls -la /usr/sbin/sendmail
```

### **3. Logs da aplicação:**
```bash
docker-compose -f docker-compose.centos7.yml logs moburb-app | grep -E "(sendmail|SMTP|mail)"
```

**Deve mostrar:**
- ✅ `"✅ Usando sendmail local do sistema"` ou
- ✅ `"⚠️ Sendmail não encontrado, usando fallback SMTP"`

## 🎉 **Resultado Esperado:**

Após a correção:
- ✅ **Sendmail instalado** e funcionando no CentOS 7
- ✅ **Container acessa** sendmail via volume mount
- ✅ **Fallback SMTP** configurado como backup
- ✅ **Emails enviados** com sucesso
- ✅ **Logs informativos** sobre método usado

## 🚀 **Execute Agora:**

**Solução Completa:**
```bash
# 1. Diagnóstico
./check-sendmail.sh

# 2. Instalação (se necessário)
sudo ./install-sendmail-centos7.sh

# 3. Deploy
./deploy-centos7.sh

# 4. Verificação
docker-compose -f docker-compose.centos7.yml logs moburb-app | grep mail
```

**🎯 O erro de sendmail deve estar resolvido após estes passos!**
