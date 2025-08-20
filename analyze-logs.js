#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzeLogs() {
  console.log('=== ANALISADOR DE LOGS ===');
  
  // Verificar logs do sistema
  const logFiles = [
    '/var/log/syslog',
    '/var/log/messages',
    '/var/log/kern.log'
  ];
  
  logFiles.forEach(logFile => {
    if (fs.existsSync(logFile)) {
      console.log(`\n--- Analisando ${logFile} ---`);
      try {
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.split('\n');
        
        // Procurar por erros relacionados ao Node.js
        const nodeErrors = lines.filter(line => 
          line.includes('node') || 
          line.includes('segmentation') || 
          line.includes('SIGSEGV') ||
          line.includes('SIGABRT')
        );
        
        if (nodeErrors.length > 0) {
          console.log('Erros encontrados:');
          nodeErrors.slice(-10).forEach(error => console.log(error));
        } else {
          console.log('Nenhum erro relacionado ao Node.js encontrado');
        }
      } catch (error) {
        console.log(`Erro ao ler ${logFile}:`, error.message);
      }
    }
  });
  
  // Verificar uso de memória e CPU
  console.log('\n--- Informações do Sistema ---');
  console.log('Node version:', process.version);
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
  console.log('Memory usage:', process.memoryUsage());
  
  // Verificar arquivos de build
  const buildDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(buildDir)) {
    console.log('\n--- Verificando Build ---');
    const buildStats = fs.statSync(buildDir);
    console.log('Build directory size:', (buildStats.size / 1024 / 1024).toFixed(2), 'MB');
    
    // Verificar se há arquivos corrompidos
    const files = fs.readdirSync(buildDir, { recursive: true });
    console.log('Total files in build:', files.length);
  }
}

// Executar análise
analyzeLogs();
