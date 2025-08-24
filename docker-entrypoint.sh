#!/bin/sh

set -e

echo "🔄 Aguardando MySQL estar disponível..."

# Função para aguardar o MySQL
wait_for_mysql() {
    until npx prisma db push --accept-data-loss 2>/dev/null; do
        echo "⏳ MySQL ainda não está pronto. Aguardando..."
        sleep 2
    done
    echo "✅ MySQL está pronto!"
}

# Aguarda o MySQL
wait_for_mysql

# Executa as migrations
echo "🔄 Executando migrations..."
npx prisma db push

# Gera o cliente Prisma (caso tenha mudanças)
echo "🔄 Gerando cliente Prisma..."
npx prisma generate

# Executa seed do banco de dados (garante dados iniciais)
echo "🔄 Executando seed do banco de dados..."
npm run seed || echo "⚠️ Seed falhou ou já executado"

echo "🚀 Iniciando aplicação..."

# Executa o comando passado como argumento
exec "$@"
