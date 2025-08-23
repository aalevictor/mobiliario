# Sistema de Recuperação de Senha

## Visão Geral

Foi implementado um sistema completo de recuperação de senha para usuários do tipo **EXTERNO** no sistema do Concurso Mobiliário Urbano. O sistema permite que usuários que esqueceram suas senhas possam solicitar uma nova senha temporária via email.

## Funcionalidades Implementadas

### 1. Link "Esqueci minha senha"
- Adicionado na tela de login (`/auth/login`)
- Redireciona para `/auth/reset`

### 2. Página de Recuperação de Senha
- **Rota**: `/auth/reset`
- **Arquivo**: `app/(open-routes)/auth/reset/page.tsx`
- **Componente**: `app/(open-routes)/auth/reset/_components/reset-password-form.tsx`
- Design consistente com a página de login
- Formulário com validação de email

### 3. Endpoint da API
- **Rota**: `/api/auth/reset-password`
- **Arquivo**: `app/api/auth/reset-password/route.ts`
- **Método**: POST
- Funcionalidades:
  - Valida se o email existe no sistema
  - Verifica se o usuário é do tipo EXTERNO
  - Gera senha temporária segura
  - Atualiza o banco de dados
  - Envia email com nova senha
  - Sempre retorna sucesso (não revela se email existe)

### 4. Template de Email
- **Arquivo**: `app/api/cadastro/_utils/email-templates.ts`
- **Função**: `templateRecuperacaoSenha(nome, novaSenha)`
- Design consistente com outros templates do sistema
- Inclui:
  - Nova senha temporária
  - Instruções de segurança
  - Link para acesso ao sistema
  - Cards informativos

### 5. Redirecionamento Inteligente
- Após login, verifica se `alterarSenha` é `true`
- Se sim, redireciona para `/auth/primeiro-login`
- Se não, redireciona para `/cadastros`

## Fluxo de Funcionamento

1. **Usuário acessa login** → Clica em "Esqueci minha senha"
2. **Redirecionamento** → Vai para `/auth/reset`
3. **Preenche email** → Submete formulário
4. **API processa** → 
   - Busca usuário EXTERNO com o email
   - Gera senha temporária (8 caracteres)
   - Atualiza banco com nova senha hash
   - Marca `alterarSenha = true`
   - Envia email com nova senha
5. **Usuário recebe email** → Com nova senha temporária
6. **Usuário faz login** → Com nova senha
7. **Sistema redireciona** → Para alteração obrigatória de senha
8. **Usuário altera senha** → Define nova senha definitiva

## Segurança

### Medidas Implementadas
- **Não revela existência de email**: Sempre retorna sucesso
- **Senha temporária segura**: 8 caracteres com maiúsculas, minúsculas e números
- **Alteração obrigatória**: Usuário deve trocar senha no próximo login
- **Hash seguro**: Usa scrypt para hash das senhas
- **Validação de tipo**: Apenas usuários EXTERNOS podem usar

### Geração de Senha
```typescript
function gerarSenhaTemporaria(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let senha = '';
  
  // Garantir pelo menos uma letra maiúscula, uma minúscula e um número
  senha += caracteres.charAt(Math.floor(Math.random() * 26)); // Letra maiúscula
  senha += caracteres.charAt(26 + Math.floor(Math.random() * 26)); // Letra minúscula
  senha += caracteres.charAt(52 + Math.floor(Math.random() * 10)); // Número
  
  // Completar com caracteres aleatórios
  for (let i = 3; i < 8; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  // Embaralhar a senha
  return senha.split('').sort(() => Math.random() - 0.5).join('');
}
```

## Arquivos Modificados/Criados

### Novos Arquivos
- `app/(open-routes)/auth/reset/page.tsx`
- `app/(open-routes)/auth/reset/_components/reset-password-form.tsx`
- `app/api/auth/reset-password/route.ts`

### Arquivos Modificados
- `app/(open-routes)/auth/login/_components/login-form.tsx` - Adicionado link "Esqueci minha senha"
- `app/api/cadastro/_utils/email-templates.ts` - Adicionado template de recuperação

## Configuração Necessária

### Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas no `.env`:

```env
# SMTP para envio de emails
MAIL_HOST=smtp.exemplo.com
MAIL_PORT=587
MAIL_USER=seu-email@exemplo.com
MAIL_PASS=sua-senha
MAIL_FROM=noreply@concursomoburb.prefeitura.sp.gov.br

# URL da aplicação
NEXT_PUBLIC_APP_URL=https://concursomoburb.prefeitura.sp.gov.br
```

## Testes

### Cenários de Teste
1. **Email não cadastrado**: Deve retornar sucesso sem enviar email
2. **Email de usuário INTERNO**: Deve retornar sucesso sem enviar email
3. **Email de usuário EXTERNO**: Deve enviar email com nova senha
4. **Login com senha temporária**: Deve redirecionar para alteração de senha
5. **Alteração de senha**: Deve permitir definir nova senha definitiva

### Como Testar
1. Acesse `/auth/login`
2. Clique em "Esqueci minha senha"
3. Digite um email de usuário EXTERNO
4. Verifique se recebeu o email
5. Faça login com a senha temporária
6. Verifique se foi redirecionado para alteração de senha

## Considerações Técnicas

### Banco de Dados
- Campo `alterarSenha` é usado para controlar redirecionamento
- Senha é sempre hasheada antes de salvar
- Apenas usuários com `tipo = 'EXTERNO'` são elegíveis

### Email
- Template responsivo e acessível
- Segue identidade visual do projeto
- Inclui informações de segurança
- Link direto para login

### Interface
- Design consistente com login
- Validação de formulário
- Feedback visual para o usuário
- Navegação intuitiva

## Manutenção

### Logs
- Erros são logados no console
- Sucesso não gera logs para não poluir
- Email de erro é tratado graciosamente

### Monitoramento
- Verificar logs de erro do SMTP
- Monitorar taxa de sucesso de envio
- Acompanhar tentativas de recuperação

## Correções Implementadas

### Posicionamento de Ícones nos Emails
- **Problema**: Os ícones nos cards dos templates de email estavam posicionados incorretamente
- **Solução**: Substituído o sistema de posicionamento baseado em `line-height` e `margin-top` por `display: flex` com `align-items: center` e `justify-content: center`
- **Resultado**: Ícones agora ficam perfeitamente centralizados tanto horizontal quanto verticalmente nos cards

## Próximos Passos (Opcionais)

1. **Rate Limiting**: Limitar tentativas por IP/email
2. **Token de Expiração**: Senha temporária com prazo de validade
3. **Auditoria**: Log de tentativas de recuperação
4. **Notificação**: Alertar usuário sobre tentativas suspeitas
