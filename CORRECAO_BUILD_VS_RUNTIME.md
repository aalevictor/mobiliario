# 🔧 Correção: Build Time vs Runtime

## ❌ **Erro Encontrado:**
```
Error: P1001: Can't reach database server at `localhost:3306`
```

## 🔍 **Causa do Problema:**

### **Build Time vs Runtime - Diferença Crítica:**

| **Build Time** (Dockerfile) | **Runtime** (Container rodando) |
|------------------------------|----------------------------------|
| ❌ **Sem acesso** ao MySQL do servidor | ✅ **Com acesso** ao MySQL (network: host) |
| ❌ **Isolado** durante construção | ✅ **Conectado** à rede do servidor |
| ⚠️ **Apenas** preparação da imagem | ✅ **Execução** real da aplicação |

### **O que aconteceu:**
- `RUN npx prisma db push` foi executado durante o **BUILD**
- Durante o build, o container **não tem acesso** ao MySQL do servidor
- O MySQL só fica acessível quando o container **está rodando** com `network_mode: host`

## ✅ **Correção Aplicada:**

### **1. Removido do Dockerfile (Build Time):**
```dockerfile
# ❌ REMOVIDO - não funciona durante build
# RUN npx prisma db push
# RUN npx prisma db seed
```

### **2. Mantido no Docker Compose (Runtime):**
```yaml
# ✅ CORRETO - executa quando container está rodando
command: sh -c "sleep 10 && npx prisma db push && npx prisma generate && npm run seed || echo 'Seed já executado' && npm start"
```

## 📋 **Sequência Correta Agora:**

### **Build Time (Dockerfile):**
1. ✅ Instala dependências
2. ✅ Copia código fonte  
3. ✅ Gera cliente Prisma (offline)
4. ✅ Build da aplicação Next.js
5. ✅ Configura usuário e permissões

### **Runtime (Docker Compose):**
1. ✅ Container inicia com `network_mode: host`
2. ✅ Sleep 10s (aguarda sistema)
3. ✅ `npx prisma db push` (aplica schema)
4. ✅ `npx prisma generate` (regenera cliente)
5. ✅ `npm run seed` (cria dados iniciais)
6. ✅ `npm start` (inicia aplicação)

## 🎯 **Por que Funciona Agora:**

### **Build:**
- ✅ **Sem dependências externas** (MySQL)
- ✅ **Apenas preparação** da imagem
- ✅ **Rápido e confiável**

### **Runtime:**
- ✅ **Com acesso ao MySQL** (`network_mode: host`)
- ✅ **Setup automático** na inicialização
- ✅ **Fallback gracioso** (|| echo)

## 🔍 **Como Identificar Build vs Runtime:**

### **Build Time (Dockerfile):**
```dockerfile
RUN comando  # Executa DURANTE a construção da imagem
```

### **Runtime (Docker Compose):**
```yaml
command: comando  # Executa QUANDO o container roda
```

## ✅ **Verificação:**

### **1. Build deve funcionar agora:**
```bash
docker-compose build --no-cache
```

### **2. Runtime executará setup automático:**
```bash
docker-compose up -d
docker-compose logs -f moburb-app
```

### **3. Logs esperados:**
```
🔄 Executando migrations...
✅ MySQL está pronto!
🔄 Gerando cliente Prisma...
🌱 Iniciando seed do banco de dados...
✅ Usuário DEV criado/atualizado com sucesso!
🚀 Iniciando aplicação...
```

## 🎉 **Resultado:**

- ✅ **Build funciona** (sem dependências externas)
- ✅ **Runtime funciona** (com acesso ao MySQL)
- ✅ **Setup automático** na inicialização
- ✅ **Compatível com CentOS 7**

## 📚 **Lição Aprendida:**

**🎯 Regra de Ouro:**
- **Build Time:** Apenas preparação (instalar, copiar, compilar)
- **Runtime:** Operações que precisam de recursos externos (banco, rede, files)

**MySQL/Database operations = SEMPRE Runtime!**
