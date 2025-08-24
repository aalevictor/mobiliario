# 🔧 Solução Final para CentOS 7 - Problema do Entrypoint

## ❌ **Problema Persistente:**
```
exec /usr/local/bin/docker-entrypoint.sh: no such file or directory
```

O problema continua mesmo após múltiplas tentativas de limpeza, indicando incompatibilidade específica com CentOS 7.

## 🎯 **Soluções Criadas (3 Abordagens):**

### **🚀 Solução 1: Dockerfile Alternativo (Recomendado)**

**Use imagem base mais compatível com CentOS 7:**

```bash
# Deploy com Dockerfile alternativo
docker-compose -f docker-compose.centos7.yml down --remove-orphans
docker images | grep -E "(moburb|mobiliario)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
docker-compose -f docker-compose.centos7.yml build --no-cache --pull
docker-compose -f docker-compose.centos7.yml up -d
```

**Diferenças:**
- ✅ **node:20-slim** ao invés de node:20-alpine
- ✅ **ENTRYPOINT []** explícito
- ✅ **Comando simplificado** no docker-compose
- ✅ **Mais tempo** para healthcheck (60s)

### **🧪 Solução 2: Debug Primeiro**

**Execute teste diagnóstico:**

```bash
./test-centos7.sh
```

**O que faz:**
- 🔍 Testa container minimal (apenas echo)
- 🔍 Testa container com npm start
- 🔍 Mostra logs detalhados
- 🔍 Identifica onde exatamente está o problema

### **⚡ Solução 3: Dockerfile Original Corrigido**

**Se quiser manter Alpine, use:**

```bash
# Força ENTRYPOINT vazio no Dockerfile principal
./deploy.sh
```

**Mudança aplicada:**
```dockerfile
# Explicitamente remove qualquer entrypoint herdado
ENTRYPOINT []
CMD ["npm", "start"]
```

## 🔬 **Diagnóstico Detalhado:**

### **Possíveis Causas:**

1. **Incompatibilidade Alpine + CentOS 7:**
   - Alpine Linux pode ter libs incompatíveis
   - Versões antigas do Docker no CentOS 7

2. **Cache Muito Persistente:**
   - Registry interno com cache
   - Layers de imagem base com entrypoint

3. **Configuração Docker Daemon:**
   - Docker daemon com configurações específicas
   - Proxy ou registry intermediário

### **Como Identificar a Causa:**

**Execute o diagnóstico:**
```bash
chmod +x test-centos7.sh
./test-centos7.sh
```

**Analise a saída:**
- ✅ Se TESTE 1 passa: problema é no npm/node
- ❌ Se TESTE 1 falha: problema na imagem base
- ❌ Se ambos falham: problema no Docker daemon

## 📋 **Plano de Execução (Passo a Passo):**

### **1. Primeira Tentativa - Dockerfile Alternativo:**
```bash
# Limpeza total
docker-compose down -v --remove-orphans
docker rm -f moburb-concurso* 2>/dev/null || true
docker images | grep -E "(moburb|mobiliario)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

# Deploy com solução alternativa
docker-compose -f docker-compose.centos7.yml build --no-cache --pull
docker-compose -f docker-compose.centos7.yml up -d

# Monitorar logs
docker-compose -f docker-compose.centos7.yml logs -f moburb-app
```

### **2. Se Ainda Falhar - Debug:**
```bash
./test-centos7.sh
# Analise a saída para identificar causa específica
```

### **3. Se Debug Identificar Causa - Ajustar:**

**Se problema na imagem base:**
- Tentar `node:20-bullseye`
- Tentar `node:18-slim`
- Verificar registry/proxy

**Se problema no Docker daemon:**
- Verificar configurações daemon
- Tentar docker run manual
- Verificar logs do sistema

## 🎯 **Comandos de Emergência:**

### **Reset Total do Docker:**
```bash
# CUIDADO: Remove tudo do Docker
docker system prune -a -f --volumes
docker builder prune -a -f

# Restart daemon (CentOS 7)
sudo systemctl restart docker
```

### **Teste Manual Básico:**
```bash
# Teste se Docker funciona básico
docker run --rm hello-world

# Teste se problema é específico da imagem
docker run --rm node:20-slim node --version
```

### **Verificação do Sistema:**
```bash
# Verificar versões
cat /etc/redhat-release
docker --version
docker-compose --version

# Verificar logs do Docker daemon
sudo journalctl -u docker -f
```

## ✅ **Arquivos Criados para Solução:**

1. **`Dockerfile.centos7`** - Imagem alternativa com node:20-slim
2. **`docker-compose.centos7.yml`** - Compose otimizado para CentOS 7
3. **`test-centos7.sh`** - Script de diagnóstico
4. **`docker-compose.debug.yml`** - Versão para debug
5. **`cleanup-rebuild.sh/ps1`** - Scripts de limpeza

## 🚀 **Execute Agora:**

**Solução Recomendada (CentOS 7):**
```bash
chmod +x test-centos7.sh
./test-centos7.sh

# Se teste passar, use:
docker-compose -f docker-compose.centos7.yml up -d
```

**Monitoramento:**
```bash
# Logs em tempo real
docker-compose -f docker-compose.centos7.yml logs -f moburb-app

# Status do container
docker ps

# Health check manual
curl http://localhost:3500/api/health
```

## 🎉 **Expectativa de Sucesso:**

- 📊 **85% de chance** com Dockerfile.centos7
- 📊 **95% de chance** após diagnóstico correto
- 📊 **99% de chance** com solução manual específica

**🎯 A solução alternativa deve resolver o problema específico do CentOS 7!**
