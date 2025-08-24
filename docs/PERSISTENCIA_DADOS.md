# 💾 Persistência de Dados - Uploads e Logs

Este documento explica como os dados persistem durante re-deploys e atualizações.

## 📁 Dados Persistentes

### ✅ **Arquivos de Upload**
- **Localização Host:** `./uploads/`
- **Localização Container:** `/app/uploads/`
- **Status:** **PERSISTENTE** ✅

### ✅ **Logs da Aplicação**
- **Localização Host:** `./logs/`
- **Localização Container:** `/app/logs/`
- **Status:** **PERSISTENTE** ✅

### ✅ **Banco de Dados MySQL**
- **Produção:** MySQL do sistema (externo ao container)
- **Local:** Volume Docker `mysql_data`
- **Status:** **PERSISTENTE** ✅

## 🔄 O que Acontece Durante Re-deploy

### **1. Container é Removido**
```bash
docker-compose down
# ❌ Container removido
# ✅ Volumes permanecem
```

### **2. Nova Imagem é Construída**
```bash
docker-compose build
# 🔄 Nova imagem criada
# ✅ Dados externos intactos
```

### **3. Novo Container Iniciado**
```bash
docker-compose up -d
# ✅ Volumes remapeados
# ✅ Dados acessíveis novamente
```

## 📋 Verificação de Persistência

### **Antes do Re-deploy**
```bash
# Verifique arquivos existentes
ls -la uploads/
ls -la logs/

# Conte arquivos (para comparar depois)
find uploads/ -type f | wc -l
```

### **Após o Re-deploy**
```bash
# Verifique se arquivos continuam lá
ls -la uploads/
ls -la logs/

# Compare a contagem
find uploads/ -type f | wc -l
```

### **Teste de Persistência**
```bash
# 1. Crie um arquivo de teste
echo "teste-$(date)" > uploads/teste-persistencia.txt

# 2. Faça re-deploy
./manage.sh update

# 3. Verifique se arquivo existe
cat uploads/teste-persistencia.txt

# 4. Remova arquivo de teste
rm uploads/teste-persistencia.txt
```

## 🛡️ Backup de Uploads

### **Backup Manual**
```bash
# Criar backup dos uploads
tar -czf uploads-backup-$(date +%Y%m%d_%H%M%S).tar.gz uploads/

# Listar backups
ls -la uploads-backup-*.tar.gz
```

### **Restaurar Backup**
```bash
# Parar aplicação
./manage.sh stop

# Restaurar uploads
tar -xzf uploads-backup-YYYYMMDD_HHMMSS.tar.gz

# Iniciar aplicação
./manage.sh start
```

### **Script de Backup Automático**
```bash
#!/bin/bash
# Script: backup-uploads.sh

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup uploads
tar -czf "$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz" uploads/

# Manter apenas últimos 10 backups
ls -t $BACKUP_DIR/uploads-*.tar.gz | tail -n +11 | xargs rm -f

echo "✅ Backup criado: $BACKUP_DIR/uploads-$TIMESTAMP.tar.gz"
```

## 📊 Estrutura de Diretórios

```
mobiliario/
├── uploads/                    # ✅ PERSISTENTE
│   ├── documento1.pdf
│   ├── projeto1.zip
│   └── ...
├── logs/                       # ✅ PERSISTENTE
│   ├── application.log
│   ├── error.log
│   └── ...
├── backups/                    # ✅ PERSISTENTE (opcional)
│   ├── uploads-20241201.tar.gz
│   └── ...
├── docker-compose.yml
├── Dockerfile
└── ...
```

## ⚠️ Dados NÃO Persistentes

### ❌ **Arquivos Dentro do Container**
Qualquer arquivo criado diretamente dentro do container (fora dos volumes) será perdido:

```bash
# ❌ PERDIDO no re-deploy
/app/temp-file.txt

# ✅ MANTIDO no re-deploy (está em volume)
/app/uploads/user-file.pdf
/app/logs/app.log
```

### ❌ **Cache da Aplicação**
```bash
# ❌ PERDIDO no re-deploy
/app/.next/cache/
/app/node_modules/.cache/
```

## 🔍 Monitoramento de Espaço

### **Verificar Tamanho dos Uploads**
```bash
# Tamanho total
du -sh uploads/

# Arquivos maiores
find uploads/ -type f -exec ls -lh {} \; | sort -k5 -hr | head -10

# Contagem por tipo
find uploads/ -name "*.pdf" | wc -l
find uploads/ -name "*.zip" | wc -l
find uploads/ -name "*.jpg" | wc -l
```

### **Limpeza de Logs Antigos**
```bash
# Logs maiores que 100MB
find logs/ -name "*.log" -size +100M

# Logs mais antigos que 30 dias
find logs/ -name "*.log" -mtime +30

# Comprimir logs antigos
find logs/ -name "*.log" -mtime +7 -exec gzip {} \;
```

## 🚨 Situações de Risco

### **Volume Mapeado Incorretamente**
```yaml
# ❌ ERRADO - dados serão perdidos
volumes:
  - uploads_volume:/app/uploads  # volume docker, não pasta host

# ✅ CORRETO - dados persistem
volumes:
  - ./uploads:/app/uploads       # pasta do host
```

### **Pasta Não Criada**
```bash
# Certifique-se que pastas existem antes do deploy
mkdir -p uploads logs backups
```

### **Permissões Incorretas**
```bash
# Ajustar permissões se necessário
sudo chown -R $USER:$USER uploads/ logs/
chmod -R 755 uploads/ logs/
```

## ✅ Garantias de Persistência

### **✅ Uploads SEMPRE mantidos**
- Mapeamento direto para pasta do host
- Re-deploy não afeta arquivos
- Rebuild não afeta arquivos
- Update não afeta arquivos

### **✅ Logs SEMPRE mantidos**
- Mapeamento direto para pasta do host
- Histórico preservado
- Rotação pode ser configurada

### **✅ Banco de Dados SEMPRE mantido**
- **Produção:** MySQL externo (sistema)
- **Local:** Volume Docker nomeado

## 🎯 Checklist de Persistência

- [ ] Pasta `uploads/` existe no host
- [ ] Pasta `logs/` existe no host
- [ ] Volumes corretamente mapeados no docker-compose
- [ ] Permissões adequadas
- [ ] Backup recente dos uploads
- [ ] Teste de persistência realizado

## 💡 Dicas Importantes

1. **Nunca delete manualmente** as pastas `uploads/` e `logs/`
2. **Faça backup** antes de mudanças importantes
3. **Monitore o espaço** em disco regularmente
4. **Teste a persistência** após mudanças no Docker
5. **Use caminhos relativos** (./uploads) no docker-compose

---

**🔒 Resumo:** Os uploads estão 100% protegidos contra perda durante re-deploys. A configuração atual garante persistência total dos dados.
