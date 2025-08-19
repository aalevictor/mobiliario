#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configurar logs detalhados
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Configurar handlers para capturar erros
process.on('uncaughtException', (error) => {
  console.error('=== UNCAUGHT EXCEPTION ===');
  console.error(error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('=== UNHANDLED REJECTION ===');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// Configurar signal handlers
process.on('SIGSEGV', (signal) => {
  console.error('=== SEGMENTATION FAULT DETECTED ===');
  console.error('Signal:', signal);
  console.error('Process ID:', process.pid);
  console.error('Memory usage:', process.memoryUsage());
  process.exit(1);
});

process.on('SIGABRT', (signal) => {
  console.error('=== ABORT SIGNAL DETECTED ===');
  console.error('Signal:', signal);
  console.error('Process ID:', process.pid);
  process.exit(1);
});

// Função para iniciar o servidor com logs detalhados
function startServer() {
  console.log('=== INICIANDO SERVIDOR COM DEBUG ===');
  console.log('Node version:', process.version);
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
  console.log('Memory usage inicial:', process.memoryUsage());
  
  const server = spawn('node', [
    '--trace-warnings',
    '--trace-uncaught',
    '--max-old-space-size=4096',
    'node_modules/.bin/next',
    'start'
  ], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--trace-warnings --trace-uncaught --max-old-space-size=4096',
      DEBUG: '*',
      NODE_ENV: 'production'
    }
  });

  server.on('error', (error) => {
    console.error('=== ERRO AO INICIAR SERVIDOR ===');
    console.error(error);
    process.exit(1);
  });

  server.on('exit', (code, signal) => {
    console.error('=== SERVIDOR ENCERRADO ===');
    console.error('Exit code:', code);
    console.error('Signal:', signal);
    process.exit(code || 1);
  });
}

// Verificar se o build existe
const buildDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(buildDir)) {
  console.error('=== ERRO: BUILD NÃO ENCONTRADO ===');
  console.error('Execute "npm run build" primeiro');
  process.exit(1);
}

startServer();
