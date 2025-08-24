# Sistema de Logs - Documentação

## Visão Geral

O sistema de logs foi implementado para registrar todas as interações e alterações no sistema, fornecendo rastreabilidade completa das operações realizadas pelos usuários e pelo sistema.

## Características Principais

- **Registro Automático**: Logs são criados automaticamente para operações CRUD
- **Rastreabilidade**: Identifica quem fez o quê e quando
- **Segurança**: Apenas usuários com permissão "DEV" podem acessar os logs
- **Filtros Avançados**: Sistema de busca e filtros para análise dos logs
- **Exportação**: Funcionalidade para exportar logs em formato CSV
- **Limpeza Automática**: Sistema para remover logs antigos
- **Logs Integrados nos Serviços**: Sistema de logs implementado diretamente nos serviços de negócio

## Arquitetura do Sistema

### 1. Logs Integrados nos Serviços (Recomendado)

Os logs são implementados diretamente nos serviços de negócio, proporcionando:

- **Contexto Rico**: Acesso completo aos dados antes e depois das operações
- **Rastreabilidade Precisa**: Logs criados no momento exato da operação
- **Separação de Responsabilidades**: APIs focadas em HTTP, serviços em lógica de negócio
- **Melhor Performance**: Evita duplicação de chamadas ao banco

### 2. Estrutura de Contexto

Todos os serviços aceitam um parâmetro opcional de contexto:

```typescript
interface ContextoLog {
  usuarioId?: string;    // ID do usuário que executa a operação
  ip?: string;           // IP do usuário
  userAgent?: string;    // User agent do navegador
}
```

## Estrutura do Banco de Dados

### Tabela `logs`

```sql
CREATE TABLE logs (
  id          VARCHAR(255) PRIMARY KEY,
  acao        VARCHAR(255) NOT NULL,        -- CREATE, UPDATE, DELETE, LOGIN, ERROR, etc.
  entidade    VARCHAR(255) NOT NULL,        -- Nome da tabela/modelo afetado
  entidadeId  VARCHAR(255),                 -- ID da entidade afetada
  dadosAntes  JSON,                         -- Dados antes da alteração
  dadosDepois JSON,                         -- Dados após a alteração
  mensagem    TEXT NOT NULL,                -- Descrição da ação
  nivel       VARCHAR(50) DEFAULT 'INFO',   -- DEBUG, INFO, WARNING, ERROR, CRITICAL
  usuarioId   VARCHAR(255),                 -- ID do usuário que executou a ação
  ip          VARCHAR(45),                  -- IP do usuário
  userAgent   TEXT,                         -- User agent do navegador
  erro        TEXT,                         -- Detalhes do erro, se houver
  stackTrace  TEXT,                         -- Stack trace do erro
  criadoEm    TIMESTAMP DEFAULT NOW(),      -- Data/hora da criação do log
  
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
);
```

## Níveis de Log

- **DEBUG**: Informações detalhadas para desenvolvimento
- **INFO**: Informações gerais sobre operações
- **WARNING**: Avisos sobre situações que merecem atenção
- **ERROR**: Erros que não impedem o funcionamento
- **CRITICAL**: Erros críticos que podem afetar o sistema

## Tipos de Ações

- **CREATE**: Criação de registros
- **UPDATE**: Atualização de registros
- **DELETE**: Exclusão de registros
- **LOGIN**: Tentativas de login (sucesso/falha)
- **ERROR**: Erros do sistema
- **ACCESS**: Acesso a funcionalidades
- **CLEANUP**: Limpeza automática de logs
- **BATCH**: Operações em lote
- **EMAIL**: Operações relacionadas a emails
- **WARNING**: Avisos do sistema

## Como Usar

### 1. Logs Automáticos

O sistema automaticamente registra:
- Logins (sucesso/falha)
- Erros durante operações
- Acesso a funcionalidades sensíveis

### 2. Logs Integrados nos Serviços

#### Exemplo de Serviço com Logs Integrados

```typescript
// services/cadastros.ts
export async function criarPreCadastro(
  preCadastro: PreCadastro,
  contexto?: { usuarioId?: string; ip?: string; userAgent?: string }
): Promise<any> {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    // Lógica de criação...
    const novo_usuario = await tx.usuario.create({...});
    
    // Log de criação do usuário
    await Logger.logCriacao("USUARIO", novo_usuario.id, {
      nome: novo_usuario.nome,
      email: novo_usuario.email,
      tipo: novo_usuario.tipo,
      permissao: novo_usuario.permissao
    }, usuarioId, ip, userAgent);
    
    // Continua a lógica...
    
  } catch (error) {
    // Log de erro geral
    await Logger.logErro("Falha crítica na criação de pré-cadastro", error as Error, {
      entidade: "CADASTRO",
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}
```

#### Exemplo de API Simplificada

```typescript
// app/api/cadastro/route.ts
export async function POST(req: NextRequest) {
  const { ip, userAgent } = capturarInfoRequisicao(req);
  
  try {
    const data = await req.json();
    
    // Chamar o serviço com contexto para logs
    const cadastro = await criarPreCadastro(data, { ip, userAgent });
    
    if (!cadastro) {
      return NextResponse.json(
        { message: "Falha ao salvar registro do cadastro." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ cadastro: cadastro }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error to save pre register:", error);
    
    return NextResponse.json(
      { message: "Falha ao enviar cadastro", error: error.message },
      { status: 500 }
    );
  }
}
```

### 3. Métodos Disponíveis

```typescript
// Log de criação
Logger.logCriacao(entidade, entidadeId, dados, usuarioId?, ip?, userAgent?)

// Log de atualização
Logger.logAtualizacao(entidade, entidadeId, dadosAntes, dadosDepois, usuarioId?, ip?, userAgent?)

// Log de exclusão
Logger.logExclusao(entidade, entidadeId, dados, usuarioId?, ip?, userAgent?)

// Log de erro
Logger.logErro(mensagem, erro, contexto?)

// Log de login
Logger.logLogin(usuarioId, sucesso, ip?, userAgent?)

// Log customizado
Logger.logCustomizado(logData)

// Log de acesso
Logger.logAcesso(funcionalidade, usuarioId, sucesso, detalhes?, ip?, userAgent?)

// Log de operação em lote
Logger.logOperacaoLote(operacao, entidade, quantidade, usuarioId?, ip?, userAgent?)
```

## Serviços com Logs Integrados

### 1. Serviço de Cadastros

- **criarPreCadastro**: Logs de criação de usuário, cadastro, participantes e emails
- **meuCadastro**: Logs de acesso ao cadastro pessoal
- **buscarCadastros**: Logs de consulta de cadastros
- **criarAvaliacaoLicitadora**: Logs de criação de avaliações
- **atualizarAvaliacaoLicitadora**: Logs de atualização com dados antes/depois

### 2. Serviço de Usuários

- **criarUsuario**: Logs de criação de usuários internos/externos
- **atualizarUsuario**: Logs de atualização com dados antes/depois
- **deletarUsuario**: Logs de exclusão com dados antes
- **alterarSenha**: Logs de alteração de senha
- **verificarPermissoes**: Logs de verificação de permissões
- **retornaPermissao**: Logs de consulta de permissões

## Interface de Usuário

### Acesso aos Logs

1. Faça login com um usuário que tenha permissão "DEV"
2. Acesse o painel administrativo
3. Clique no menu "Logs"

### Funcionalidades da Interface

- **Filtros**: Por ação, entidade, nível, usuário, data e busca geral
- **Visualização**: Lista paginada de logs com detalhes
- **Detalhes**: Modal com informações completas de cada log
- **Exportação**: Download dos logs em formato CSV
- **Limpeza**: Remoção de logs antigos (configurável)

### Filtros Disponíveis

- **Busca Geral**: Pesquisa em mensagens, entidades e ações
- **Ação**: Filtra por tipo de ação (CREATE, UPDATE, DELETE, etc.)
- **Entidade**: Filtra por tabela/modelo afetado
- **Nível**: Filtra por nível de log
- **Usuário**: Filtra por usuário que executou a ação
- **Data**: Filtra por período específico

## Configuração

### Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### Permissões

- Apenas usuários com permissão "DEV" podem acessar os logs
- Usuários com permissão "ADMIN" não têm acesso aos logs por padrão

## Manutenção

### Limpeza Automática

- Os logs são mantidos por 90 dias por padrão
- Use a funcionalidade "Limpar Logs Antigos" para remover registros antigos
- A limpeza é registrada no próprio sistema de logs

### Backup

- Considere fazer backup regular da tabela `logs`
- Os logs podem ser exportados em CSV para análise externa

## Exemplos de Uso

### 1. Log de Criação de Usuário

```typescript
await Logger.logCriacao("USUARIO", novoUsuario.id, {
  nome: novoUsuario.nome,
  email: novoUsuario.email,
  permissao: novoUsuario.permissao
}, usuarioId, ip, userAgent);
```

### 2. Log de Atualização de Cadastro

```typescript
await Logger.logAtualizacao("CADASTRO", cadastroId, dadosAntes, dadosDepois, usuarioId, ip, userAgent);
```

### 3. Log de Erro Durante Operação

```typescript
try {
  // Operação
} catch (error) {
  await Logger.logErro("Falha ao processar arquivo", error, {
    entidade: "ARQUIVO",
    entidadeId: arquivoId,
    usuarioId,
    ip,
    userAgent
  });
}
```

### 4. Log de Acesso a Funcionalidade

```typescript
await Logger.logAcesso("EXPORTAR_DADOS", usuarioId, true, "Exportação de relatório mensal", ip, userAgent);
```

### 5. Log de Operação em Lote

```typescript
await Logger.logOperacaoLote("CREATE", "PARTICIPANTE", participantes.length, usuarioId, ip, userAgent);
```

## Monitoramento

### Logs Importantes para Monitorar

- **ERROR**: Erros que podem indicar problemas no sistema
- **CRITICAL**: Problemas críticos que requerem atenção imediata
- **LOGIN**: Tentativas de login falhadas (possíveis ataques)
- **ACCESS**: Acesso negado a funcionalidades
- **EMAIL**: Falhas no envio de emails
- **WARNING**: Avisos sobre configurações ou operações

### Alertas Recomendados

- Muitos erros em sequência
- Tentativas de login falhadas de um mesmo IP
- Acessos negados a funcionalidades sensíveis
- Logs críticos
- Falhas no envio de emails
- Operações de exclusão em massa

## Troubleshooting

### Problemas Comuns

1. **Erro de permissão ao acessar logs**
   - Verifique se o usuário tem permissão "DEV"

2. **Logs não estão sendo criados**
   - Verifique se o banco de dados está funcionando
   - Verifique se as tabelas foram criadas corretamente
   - Verifique se os serviços estão sendo chamados com contexto

3. **Performance lenta na consulta de logs**
   - Considere adicionar índices na tabela
   - Use filtros para limitar os resultados
   - Limpe logs antigos regularmente

### Índices Recomendados

```sql
CREATE INDEX idx_logs_criado_em ON logs(criadoEm);
CREATE INDEX idx_logs_usuario_id ON logs(usuarioId);
CREATE INDEX idx_logs_acao ON logs(acao);
CREATE INDEX idx_logs_entidade ON logs(entidade);
CREATE INDEX idx_logs_nivel ON logs(nivel);
```

## Vantagens da Nova Abordagem

### 1. **Contexto Rico**
- Acesso completo aos dados antes e depois das operações
- Captura de erros no momento exato que ocorrem
- Informações detalhadas sobre o estado da operação

### 2. **Separação de Responsabilidades**
- APIs focadas em comunicação HTTP
- Serviços responsáveis pela lógica de negócio e logs
- Código mais organizado e manutenível

### 3. **Performance**
- Evita duplicação de chamadas ao banco
- Logs criados durante a transação principal
- Melhor controle sobre quando e como os logs são criados

### 4. **Rastreabilidade**
- Logs criados no momento exato da operação
- Captura de rollbacks e erros de transação
- Histórico completo de mudanças

## Conclusão

O sistema de logs integrado nos serviços fornece uma base sólida para:

- **Auditoria e compliance**: Rastreabilidade completa de todas as operações
- **Debugging e troubleshooting**: Contexto rico para identificar problemas
- **Monitoramento de segurança**: Acompanhamento de acessos e tentativas de invasão
- **Análise de uso do sistema**: Entendimento de como o sistema é utilizado
- **Rastreabilidade de operações**: Histórico completo de mudanças

Implemente os logs em todos os serviços críticos do sistema para maximizar a visibilidade e controle sobre as atividades realizadas. A abordagem de logs integrados nos serviços é a mais eficiente e recomendada para sistemas em produção.
