# Guia Prático: Implementando Logs em Novos Serviços

## Visão Geral

Este guia demonstra como implementar o sistema de logs em novos serviços seguindo o padrão estabelecido no sistema.

## Estrutura Básica

### 1. Importar o Logger

```typescript
import { Logger } from '@/lib/logger';
```

### 2. Adicionar Parâmetro de Contexto

```typescript
interface ContextoLog {
  usuarioId?: string;    // ID do usuário que executa a operação
  ip?: string;           // IP do usuário
  userAgent?: string;    // User agent do navegador
}

export async function minhaFuncao(
  dados: MeusDados,
  contexto?: ContextoLog
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  // ... implementação
}
```

## Exemplos Práticos

### 1. Função de Criação

```typescript
export async function criarDocumento(
  dados: DocumentoDTO,
  contexto?: ContextoLog
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    // Buscar dados existentes para comparação (se aplicável)
    const documentoExistente = await db.documento.findFirst({
      where: { titulo: dados.titulo }
    });
    
    if (documentoExistente) {
      // Log de tentativa de criação de documento duplicado
      await Logger.logCustomizado({
        acao: "WARNING",
        entidade: "DOCUMENTO",
        mensagem: `Tentativa de criar documento com título duplicado: ${dados.titulo}`,
        nivel: "WARNING",
        usuarioId,
        ip,
        userAgent
      });
      
      throw new Error("Documento com este título já existe");
    }
    
    // Criar o documento
    const novoDocumento = await db.documento.create({
      data: dados
    });
    
    // Log de criação bem-sucedida
    await Logger.logCriacao("DOCUMENTO", novoDocumento.id, {
      titulo: novoDocumento.titulo,
      tipo: novoDocumento.tipo,
      tamanho: novoDocumento.tamanho,
      criadoPor: novoDocumento.criadoPor
    }, usuarioId, ip, userAgent);
    
    return novoDocumento;
    
  } catch (error) {
    // Log de erro durante a criação
    await Logger.logErro("Erro ao criar documento", error as Error, {
      entidade: "DOCUMENTO",
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}
```

### 2. Função de Atualização

```typescript
export async function atualizarDocumento(
  id: string,
  dados: Partial<DocumentoDTO>,
  contexto?: ContextoLog
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    // Buscar dados antes da atualização
    const documentoAntes = await db.documento.findUnique({
      where: { id },
      select: { titulo: true, tipo: true, tamanho: true, atualizadoPor: true }
    });
    
    if (!documentoAntes) {
      // Log de tentativa de atualizar documento inexistente
      await Logger.logAcesso("ATUALIZAR_DOCUMENTO", usuarioId || "SISTEMA", false, 
        `Documento ${id} não encontrado para atualização`, ip, userAgent
      );
      
      throw new Error("Documento não encontrado");
    }
    
    // Atualizar o documento
    const documentoAtualizado = await db.documento.update({
      where: { id },
      data: dados
    });
    
    // Log de atualização com dados antes e depois
    await Logger.logAtualizacao("DOCUMENTO", id, documentoAntes, {
      titulo: dados.titulo,
      tipo: dados.tipo,
      tamanho: dados.tamanho,
      atualizadoPor: dados.atualizadoPor
    }, usuarioId, ip, userAgent);
    
    return documentoAtualizado;
    
  } catch (error) {
    // Log de erro durante a atualização
    await Logger.logErro("Erro ao atualizar documento", error as Error, {
      entidade: "DOCUMENTO",
      entidadeId: id,
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}
```

### 3. Função de Exclusão

```typescript
export async function deletarDocumento(
  id: string,
  contexto?: ContextoLog
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    // Buscar dados antes da exclusão
    const documentoAntes = await db.documento.findUnique({
      where: { id },
      select: { titulo: true, tipo: true, tamanho: true, criadoPor: true }
    });
    
    if (!documentoAntes) {
      // Log de tentativa de deletar documento inexistente
      await Logger.logAcesso("DELETAR_DOCUMENTO", usuarioId || "SISTEMA", false, 
        `Documento ${id} não encontrado para exclusão`, ip, userAgent
      );
      
      throw new Error("Documento não encontrado");
    }
    
    // Deletar o documento
    const documentoDeletado = await db.documento.delete({
      where: { id }
    });
    
    // Log de exclusão com dados antes
    await Logger.logExclusao("DOCUMENTO", id, documentoAntes, usuarioId, ip, userAgent);
    
    return documentoDeletado;
    
  } catch (error) {
    // Log de erro durante a exclusão
    await Logger.logErro("Erro ao deletar documento", error as Error, {
      entidade: "DOCUMENTO",
      entidadeId: id,
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}
```

### 4. Função de Consulta

```typescript
export async function buscarDocumentos(
  filtros: FiltrosDocumento,
  contexto?: ContextoLog
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    // Aplicar filtros
    const where = {};
    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.criadoPor) where.criadoPor = filtros.criadoPor;
    if (filtros.busca) {
      where.OR = [
        { titulo: { contains: filtros.busca, mode: 'insensitive' } },
        { descricao: { contains: filtros.busca, mode: 'insensitive' } }
      ];
    }
    
    // Executar consulta
    const documentos = await db.documento.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      take: filtros.limite || 20,
      skip: (filtros.pagina - 1) * (filtros.limite || 20)
    });
    
    const total = await db.documento.count({ where });
    
    // Log de consulta bem-sucedida
    await Logger.logAcesso("BUSCAR_DOCUMENTOS", usuarioId || "SISTEMA", true, 
      `Consulta retornou ${documentos.length} documentos de ${total} total`, ip, userAgent
    );
    
    return {
      documentos,
      total,
      pagina: filtros.pagina,
      limite: filtros.limite || 20
    };
    
  } catch (error) {
    // Log de erro durante a consulta
    await Logger.logErro("Erro ao buscar documentos", error as Error, {
      entidade: "DOCUMENTO",
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}
```

### 5. Função com Operações em Lote

```typescript
export async function processarDocumentosEmLote(
  ids: string[],
  operacao: 'APROVAR' | 'REPROVAR' | 'ARQUIVAR',
  contexto?: ContextoLog
) {
  const { usuarioId, ip, userAgent } = contexto || {};
  
  try {
    // Buscar documentos antes da operação
    const documentosAntes = await db.documento.findMany({
      where: { id: { in: ids } },
      select: { id: true, titulo: true, status: true }
    });
    
    // Executar operação em lote
    const resultado = await db.documento.updateMany({
      where: { id: { in: ids } },
      data: { 
        status: operacao === 'APROVAR' ? 'APROVADO' : 
                operacao === 'REPROVAR' ? 'REPROVADO' : 'ARQUIVADO',
        atualizadoPor: usuarioId,
        atualizadoEm: new Date()
      }
    });
    
    // Log de operação em lote
    await Logger.logOperacaoLote(
      operacao, 
      "DOCUMENTO", 
      resultado.count, 
      usuarioId, 
      ip, 
      userAgent
    );
    
    // Log detalhado de cada documento alterado
    for (const doc of documentosAntes) {
      await Logger.logAtualizacao("DOCUMENTO", doc.id, 
        { status: doc.status }, 
        { 
          status: operacao === 'APROVAR' ? 'APROVADO' : 
                  operacao === 'REPROVAR' ? 'REPROVADO' : 'ARQUIVADO',
          atualizadoPor: usuarioId
        }, 
        usuarioId, ip, userAgent
      );
    }
    
    return resultado;
    
  } catch (error) {
    // Log de erro durante a operação em lote
    await Logger.logErro("Erro ao processar documentos em lote", error as Error, {
      entidade: "DOCUMENTO",
      usuarioId,
      ip,
      userAgent
    });
    
    throw error;
  }
}
```

## Padrões Recomendados

### 1. **Sempre Capturar Contexto**
```typescript
const { usuarioId, ip, userAgent } = contexto || {};
```

### 2. **Logs de Sucesso Após Operação**
```typescript
// Após criar/atualizar/deletar com sucesso
await Logger.logCriacao("ENTIDADE", id, dados, usuarioId, ip, userAgent);
```

### 3. **Logs de Erro com Try/Catch**
```typescript
try {
  // operação
} catch (error) {
  await Logger.logErro("Mensagem descritiva", error as Error, {
    entidade: "ENTIDADE",
    entidadeId: id,
    usuarioId,
    ip,
    userAgent
  });
  throw error;
}
```

### 4. **Logs de Acesso para Consultas**
```typescript
await Logger.logAcesso("FUNCIONALIDADE", usuarioId, sucesso, detalhes, ip, userAgent);
```

### 5. **Logs de Operações em Lote**
```typescript
await Logger.logOperacaoLote(operacao, entidade, quantidade, usuarioId, ip, userAgent);
```

## Integração com APIs

### API Simplificada

```typescript
// app/api/documentos/route.ts
export async function POST(req: NextRequest) {
  const { ip, userAgent } = capturarInfoRequisicao(req);
  
  try {
    const data = await req.json();
    
    // Chamar serviço com contexto
    const documento = await criarDocumento(data, { ip, userAgent });
    
    return NextResponse.json({ documento }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### API com Autenticação

```typescript
// app/api/documentos/[id]/route.ts
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  
  const { ip, userAgent } = capturarInfoRequisicao(req);
  
  try {
    const data = await req.json();
    
    // Chamar serviço com contexto completo
    const documento = await atualizarDocumento(params.id, data, {
      usuarioId: session.user.id,
      ip,
      userAgent
    });
    
    return NextResponse.json({ documento });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## Boas Práticas

### 1. **Mensagens Descritivas**
```typescript
// ✅ Bom
await Logger.logErro("Falha ao processar arquivo PDF", error, {...});

// ❌ Ruim
await Logger.logErro("Erro", error, {...});
```

### 2. **Capturar Dados Relevantes**
```typescript
// ✅ Bom - dados específicos
await Logger.logCriacao("USUARIO", usuario.id, {
  nome: usuario.nome,
  email: usuario.email,
  permissao: usuario.permissao
}, usuarioId, ip, userAgent);

// ❌ Ruim - dados genéricos
await Logger.logCriacao("USUARIO", usuario.id, usuario, usuarioId, ip, userAgent);
```

### 3. **Logs de Acesso para Operações Sensíveis**
```typescript
// ✅ Bom - log de acesso
await Logger.logAcesso("EXPORTAR_DADOS", usuarioId, true, "Exportação de relatório mensal", ip, userAgent);

// ❌ Ruim - sem log de acesso
// Nenhum log para operações sensíveis
```

### 4. **Tratamento de Erros Consistente**
```typescript
// ✅ Bom - sempre logar erros
try {
  // operação
} catch (error) {
  await Logger.logErro("Descrição do erro", error as Error, contexto);
  throw error;
}

// ❌ Ruim - ignorar erros
try {
  // operação
} catch (error) {
  // Sem log do erro
  throw error;
}
```

## Conclusão

Seguindo estes padrões, você terá:

- **Logs consistentes** em todo o sistema
- **Rastreabilidade completa** de todas as operações
- **Debugging eficiente** com contexto rico
- **Auditoria robusta** para compliance
- **Monitoramento de segurança** em tempo real

Implemente logs em todos os serviços críticos para maximizar a visibilidade e controle sobre as atividades do sistema.
