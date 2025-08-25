# 🌱 Configuração do Seed no Deploy

## ✅ Status Atual - SEED CONFIGURADO

O seed **ESTÁ CONFIGURADO** para rodar automaticamente em **todos os cenários** de deploy:

### 🚀 **Deploy de Produção (`deploy.sh`)**
```bash
# Sequência automática:
1. Para containers existentes
2. Rebuild das imagens
3. ✅ Executa migrations
4. ✅ Executa SEED automaticamente
5. Inicia containers
6. Testa health check
```

**Comando executado:**
```bash
$DOCKER_COMPOSE run --rm moburb-app npm run seed
```

### 🖥️ **Deploy Local (`deploy-local.ps1`)**
```powershell
# Sequência automática:
1. Para containers existentes
2. Rebuild das imagens
3. Inicia containers
4. ✅ Executa SEED automaticamente
5. Aguarda inicialização
6. Testa health check
```

**Comando executado:**
```powershell
& $dockerCompose -f docker-compose.local.yml exec moburb-app npm run seed
```

### 🐳 **Container Entrypoint (`docker-entrypoint.sh`)**
```bash
# Sequência automática em TODA inicialização:
1. Aguarda MySQL estar disponível
2. Executa migrations (prisma db push)
3. Gera cliente Prisma
4. ✅ Executa SEED automaticamente
5. Inicia aplicação
```

**Comando executado:**
```bash
npm run seed || echo "⚠️ Seed falhou ou já executado"
```

## 🎯 Garantias de Execução

### ✅ **Cenários Cobertos:**
- **Deploy inicial** → Seed executado
- **Deploy de atualização** → Seed executado
- **Rebuild de container** → Seed executado  
- **Restart de container** → Seed executado
- **Restart do servidor** → Seed executado

### 🛡️ **Proteções Implementadas:**
- **Upsert no seed** → Não duplica dados
- **Falha silenciosa** → Não quebra inicialização
- **Idempotente** → Pode rodar múltiplas vezes
- **Logs detalhados** → Facilita debugging

## 🔍 **Como Verificar se Rodou**

### **1. Logs do Deploy:**
```bash
# Durante deploy
./deploy.sh
# Procure por: "🔄 Executando seed do banco de dados..."
```

### **2. Logs do Container:**
```bash
# Verificar logs
docker-compose logs moburb-app | grep seed
# Ou
./manage.sh logs | grep seed
```

### **3. Verificação no Banco:**
```sql
-- Verificar se usuário do seed existe
SELECT * FROM usuarios WHERE email = 'vmabreu@prefeitura.sp.gov.br';
```

### **4. Interface de Logs:**
- Acesse: `/admin/logs`
- Filtre por: Operação = "SEED" ou "DATABASE_OPERATION"

## ⚙️ **Configuração do Seed**

### **Arquivo:** `prisma/seed.js`
```javascript
// Executa upsert do usuário administrador
const user = await prisma.usuario.upsert({
  where: { email: 'vmabreu@prefeitura.sp.gov.br' },
  update: { /* atualiza dados */ },
  create: { /* cria novo */ }
});
```

### **Comando:** `npm run seed`
```json
// package.json
{
  "scripts": {
    "seed": "npx prisma db seed"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

## 🚨 **Troubleshooting**

### **Se seed não executar:**

1. **Verificar logs de erro:**
   ```bash
   docker-compose logs moburb-app | tail -50
   ```

2. **Executar manualmente:**
   ```bash
   # Produção
   docker-compose exec moburb-app npm run seed
   
   # Local
   docker-compose -f docker-compose.local.yml exec moburb-app npm run seed
   ```

3. **Verificar prisma client:**
   ```bash
   docker-compose exec moburb-app npx prisma generate
   ```

### **Se usuário não for criado:**

1. **Verificar conexão com banco:**
   ```bash
   docker-compose exec moburb-app npx prisma db pull
   ```

2. **Verificar schema atualizado:**
   ```bash
   docker-compose exec moburb-app npx prisma migrate status
   ```

3. **Executar seed com debug:**
   ```bash
   docker-compose exec moburb-app node -e "
   require('./prisma/seed.js')
     .then(() => console.log('Seed OK'))
     .catch(err => console.error('Seed ERROR:', err))
   "
   ```

## 📊 **Dados Criados pelo Seed**

### **Usuário Administrador:**
- **Nome:** Victor Alexander Menezes de Abreu
- **Email:** vmabreu@prefeitura.sp.gov.br
- **Login:** d927014
- **Permissão:** DEV
- **Tipo:** INTERNO
- **Senha:** `mudar123`
- **Status:** Ativo
- **Primeiro acesso:** Deve alterar senha

## ✅ **Resumo**

🎯 **O seed ESTÁ CONFIGURADO e roda automaticamente em TODOS os deploys**

- ✅ Deploy produção
- ✅ Deploy local  
- ✅ Restart de container
- ✅ Rebuild de imagem
- ✅ Inicialização do sistema

**Não é necessário executar manualmente** - o sistema garante que sempre haverá um usuário administrador disponível!
