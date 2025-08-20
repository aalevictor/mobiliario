# Guia de Debug para Segmentation Fault

Este guia ajuda a diagnosticar e resolver erros de segmentation fault em aplicações Next.js.

## Comandos Disponíveis

### 1. Iniciar com Debug Detalhado
```bash
npm run debug
```
Este comando inicia o servidor com logs detalhados e captura de erros.

### 2. Iniciar com Logs Verbosos
```bash
npm run start:verbose
```
Inicia o servidor com trace de warnings e exceções não capturadas.

### 3. Iniciar com Debug de Memória
```bash
npm run start:memory
```
Inicia o servidor com debug de garbage collection e limite de memória aumentado.

### 4. Analisar Logs do Sistema
```bash
npm run analyze
```
Analisa logs do sistema em busca de erros relacionados ao Node.js.

## Causas Comuns de Segmentation Fault

### 1. Problemas de Memória
- **Solução**: Aumentar heap size
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

### 2. Dependências Nativas
- **Solução**: Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. Problemas com Prisma
- **Solução**: Regenerar cliente Prisma
```bash
npx prisma generate
```

### 4. Arquitetura Incompatível
- **Solução**: Verificar compatibilidade
```bash
node --version
npm --version
```

## Passos para Diagnóstico

### 1. Verificar Logs do Sistema
```bash
# Linux
sudo dmesg | grep -i segfault
sudo journalctl -u your-service -f

# Windows
Get-EventLog -LogName Application -Source "Node.js" -Newest 50
```

### 2. Verificar Uso de Recursos
```bash
# Monitorar memória
htop
# ou
top

# Verificar processos Node.js
ps aux | grep node
```

### 3. Testar com Build Limpo
```bash
# Limpar build
rm -rf .next
npm run build
npm run debug
```

### 4. Verificar Dependências
```bash
# Verificar vulnerabilidades
npm audit

# Verificar dependências desatualizadas
npm outdated
```

## Configurações de Ambiente

### Variáveis de Ambiente para Debug
```bash
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export DEBUG=*
export NODE_OPTIONS="--trace-warnings --trace-uncaught --max-old-space-size=4096"
```

### Configurações do Next.js
O arquivo `next.config.ts` já está configurado com:
- Logging detalhado
- Configurações de webpack para produção
- Headers CORS

## Soluções Específicas

### Para Servidores Linux
```bash
# Instalar ferramentas de debug
sudo apt-get install gdb valgrind

# Executar com gdb
gdb --args node node_modules/.bin/next start
```

### Para Servidores Windows
```bash
# Usar Process Monitor para debug
# Baixar do Sysinternals Suite

# Verificar logs do Event Viewer
eventvwr.msc
```

### Para Containers Docker
```bash
# Executar com debug
docker run --cap-add=SYS_PTRACE --security-opt seccomp=unconfined your-image

# Verificar logs do container
docker logs your-container
```

## Monitoramento Contínuo

### Script de Monitoramento
```bash
#!/bin/bash
while true; do
  if ! pgrep -f "next start" > /dev/null; then
    echo "$(date): Servidor caiu, reiniciando..."
    npm run debug >> debug.log 2>&1 &
  fi
  sleep 30
done
```

### Alertas de Sistema
Configure alertas para:
- Uso de memória > 80%
- CPU > 90%
- Processos Node.js mortos
- Logs de erro

## Contato para Suporte

Se o problema persistir, colete:
1. Logs completos do sistema
2. Output do comando `npm run analyze`
3. Informações do servidor (OS, Node.js version, etc.)
4. Stack trace completo do erro
