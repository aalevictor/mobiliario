# Sistema de Templates de Email

Este sistema oferece templates de email modularizados seguindo a identidade visual oficial da Prefeitura de São Paulo para o Concurso Mobiliário Urbano.

## 🎨 Identidade Visual

O sistema utiliza as cores oficiais do projeto:

- **Dourado Principal**: `#A5942B` (navbar, footer, elementos principais)
- **Verde Claro**: `#F3F9E7` (backgrounds secundários)
- **Roxo Destaque**: `#7874C1` (call-to-actions, badges)
- **Marrom Escuro**: `#3B2D3A` (textos principais)
- **Cinza Secundário**: `#6b7280` (textos secundários)

## 📧 Templates Disponíveis

### 1. Template de Confirmação de Inscrição
```typescript
import { templateConfirmacaoInscricao } from './email-templates';

const emailHTML = templateConfirmacaoInscricao('João Silva');
```

**Uso**: Enviado automaticamente quando um participante completa sua inscrição.

### 2. Template de Notificação Geral
```typescript
import { templateNotificacao } from './email-templates';

const emailHTML = templateNotificacao(
  'Maria Santos',
  'Resultado da Primeira Fase',
  'Informamos que o resultado da primeira fase foi divulgado. Acesse nossa plataforma para verificar sua situação.'
);
```

**Uso**: Para comunicações importantes sobre o andamento do concurso.

### 3. Template de Lembrete
```typescript
import { templateLembrete } from './email-templates';

const emailHTML = templateLembrete(
  'Carlos Oliveira',
  'Entrega de Documentos',
  '25 de março de 2024'
);
```

**Uso**: Para lembretes de prazos, eventos ou etapas importantes.

### 4. Template de Boas-vindas
```typescript
import { templateBoasVindas } from './email-templates';

const emailHTML = templateBoasVindas('Ana Costa');
```

**Uso**: Primeiro contato com novos participantes cadastrados.

## 🛠️ Template Customizável

Para casos mais específicos, use o template base configurável:

```typescript
import { gerarEmailTemplate } from './email-templates';

const emailHTML = gerarEmailTemplate({
  nome: 'Pedro Santos',
  titulo: 'Título Personalizado',
  subtitulo: 'Subtítulo opcional',
  conteudoPrincipal: `
    <p>Seu conteúdo em HTML aqui.</p>
    <p>Pode incluir <strong>formatação</strong> e múltiplos parágrafos.</p>
  `,
  mostrarCards: true,
  cardsPersonalizados: [
    {
      titulo: 'Documentação',
      descricao: 'Mantenha seus documentos atualizados.'
    },
    {
      titulo: 'Cronograma',
      descricao: 'Acompanhe as datas importantes.'
    }
  ],
  botaoTexto: 'Acessar Portal',
  botaoUrl: 'https://exemplo.com'
});
```

## 📋 Propriedades do Template Configurável

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `nome` | string | 'Participante' | Nome do destinatário |
| `titulo` | string | 'Informações Importantes' | Título principal do email |
| `subtitulo` | string | 'Acompanhe as novidades...' | Subtítulo do banner |
| `conteudoPrincipal` | string | 'Obrigado por participar...' | Conteúdo principal em HTML |
| `botaoTexto` | string | 'Acessar Portal' | Texto do botão de ação |
| `botaoUrl` | string | 'https://...' | URL do botão de ação |
| `mostrarCards` | boolean | false | Se deve exibir cards informativos |
| `cardsPersonalizados` | Array | [] | Array de objetos com título e descrição |

## 🎯 Componentes Modulares

O sistema é construído com componentes reutilizáveis:

- **Cabeçalho**: Logo e branding da Prefeitura
- **Banner Hero**: Seção principal com título e subtítulo
- **Conteúdo Principal**: Área para mensagem personalizada
- **Cards Informativos**: Blocos de informação adicional
- **Call to Action**: Seção com botão de ação
- **Rodapé**: Informações de contato e links úteis

## 📱 Responsividade

Todos os templates incluem:

- Design responsivo para mobile, tablet e desktop
- Compatibilidade com clientes de email antigos
- Suporte para modo escuro
- Otimização para Outlook e Gmail

## 🔧 Implementação em APIs

### Exemplo no endpoint de cadastro:

```typescript
// app/api/cadastro/route.ts
import { templateConfirmacaoInscricao } from './_utils/email-templates';
import { enviarEmail } from '@/lib/nodemailer';

export async function POST(request: Request) {
  // ... lógica de cadastro
  
  // Enviar email de confirmação
  const emailHTML = templateConfirmacaoInscricao(dadosUsuario.nome);
  
  await enviarEmail({
    to: dadosUsuario.email,
    subject: 'Confirmação de Inscrição - Concurso Mobiliário Urbano',
    html: emailHTML
  });
  
  // ... resto da implementação
}
```

## 🎨 Customização Avançada

Para modificar cores ou estilos globais, edite o objeto `styles` no arquivo `email-templates.ts`:

```typescript
const styles: EmailStyles = {
  corPrimaria: '#A5942B',     // Cor principal
  corSecundaria: '#F3F9E7',   // Cor secundária  
  corFundo: '#f9fafb',        // Cor de fundo
  corTexto: '#3B2D3A',        // Cor do texto principal
  corTextoSecundario: '#6b7280', // Cor do texto secundário
  corDestaque: '#7874C1'      // Cor de destaque
};
```

## 📝 Boas Práticas

1. **Sempre teste** os emails em diferentes clientes (Gmail, Outlook, Apple Mail)
2. **Use textos claros** e objetivos nas mensagens
3. **Inclua call-to-actions** relevantes para cada contexto
4. **Mantenha consistência** com a identidade visual do site
5. **Considere acessibilidade** com cores contrastantes e textos descritivos

## 🔍 Debugging

Para visualizar o HTML gerado durante desenvolvimento:

```typescript
const emailHTML = templateConfirmacaoInscricao('Teste');
console.log(emailHTML); // ou salve em arquivo .html para visualizar no browser
```

## 📞 Suporte

Para dúvidas ou melhorias neste sistema, consulte a documentação técnica do projeto ou entre em contato com a equipe de desenvolvimento.
