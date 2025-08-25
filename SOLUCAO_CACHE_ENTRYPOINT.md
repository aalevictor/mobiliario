# 🔧 Solução: Cache de Entrypoint no Docker

## ❌ **Problema:**
```
exec /usr/local/bin/docker-entrypoint.sh: no such file or directory
```

**Causa:** Docker está usando **imagem em cache** que ainda contém o ENTRYPOINT antigo.

## 🔍 **Por que acontece:**
1. **Cache do Docker** mantém layers antigas
2. **Imagens antigas** podem ter ENTRYPOINT definido
3. **Mudanças no Dockerfile** podem não ser aplicadas se o cache não for limpo
4. **Container tenta executar** entrypoint que não existe mais

## ✅ **Soluções (3 opções):**

### **🚀 Opção 1: Script Automático (Recomendado)**

**Para CentOS 7 (Produção):**
```bash
./cleanup-rebuild.sh
```

**Para Windows (Desenvolvimento):**
```powershell
.\cleanup-rebuild.ps1
```

### **🔨 Opção 2: Deploy Melhorado**

O `deploy.sh` foi atualizado com limpeza automática:
```bash
./deploy.sh
```

**O que faz agora:**
- ✅ Para containers com `--remove-orphans`
- ✅ Remove containers órfãos por nome
- ✅ Remove **todas** imagens relacionadas ao projeto
- ✅ Build sem cache com `--no-cache --pull`

### **⚡ Opção 3: Manual (Para troubleshooting)**

```bash
# 1. Para tudo
docker-compose down -v --remove-orphans

# 2. Remove containers órfãos
docker rm -f moburb-concurso moburb-app

# 3. Remove TODAS as imagens do projeto
docker images | grep -E "(moburb|mobiliario)" | awk '{print $3}' | xargs docker rmi -f

# 4. Limpeza geral
docker system prune -f
docker builder prune -f

# 5. Rebuild total
docker-compose build --no-cache --pull

# 6. Inicia
docker-compose up -d
```

## 🔍 **Como Verificar se Funcionou:**

### **1. Verificar nova imagem:**
```bash
# Listar imagens
docker images | grep mobiliario

# Inspecionar configuração
docker inspect <IMAGE_ID> | grep -i entrypoint
```

### **2. Logs do container:**
```bash
# Deve mostrar o comando correto agora
docker-compose logs moburb-app

# Deve mostrar algo como:
# sleep 10 && npx prisma db push && npx prisma generate...
```

### **3. Verificar processo:**
```bash
# Entrar no container
docker-compose exec moburb-app sh

# Ver processo principal
ps aux | head -5
```

## 📋 **Sequência Esperada (Correta):**

```
🔄 Iniciando containers com setup automático...
⏰ Aguardando 10 segundos...
📊 Executando prisma db push...
🔧 Executando prisma generate...
🌱 Executando npm run seed...
✅ Seed executado com sucesso!
🚀 Executando npm start...
▶️ Next.js started on http://localhost:3500
```

## ⚠️ **Se AINDA der erro:**

### **Problema pode ser:**
1. **Imagem base corrupta** no cache
2. **Multiple Dockerfile** confundindo o build
3. **Registry cache** (se usando registry privado)

### **Solução Radical:**
```bash
# Remove TUDO relacionado ao Docker
docker system prune -a -f --volumes

# Remove build cache
docker builder prune -a -f

# Rebuild total
docker-compose build --no-cache --pull
```

## 🎯 **Prevenção Futura:**

### **1. Sempre use --no-cache para mudanças importantes:**
```bash
docker-compose build --no-cache
```

### **2. Limpe cache periodicamente:**
```bash
docker system prune -f
```

### **3. Use tags específicas:**
```yaml
# docker-compose.yml
image: mobiliario:${BUILD_NUMBER:-latest}
```

## ✅ **Status das Correções:**

- ✅ **Dockerfile corrigido** (sem ENTRYPOINT)
- ✅ **Docker-compose atualizado** (command correto)
- ✅ **Deploy.sh melhorado** (limpeza automática)
- ✅ **Scripts de limpeza** criados
- ✅ **Documentação** completa

## 🎉 **Executar Agora:**

**Produção (CentOS 7):**
```bash
./cleanup-rebuild.sh
```

**Desenvolvimento (Windows):**
```powershell
.\cleanup-rebuild.ps1
```

**Ou simplesmente:**
```bash
./deploy.sh  # Agora com limpeza automática
```

**🎯 A aplicação deve inicializar corretamente sem erro de entrypoint!**
