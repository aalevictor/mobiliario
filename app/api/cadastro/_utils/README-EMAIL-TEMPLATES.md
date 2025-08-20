# Sistema de Templates de Email - Concurso Mobiliário Urbano

Este sistema fornece templates de email modulares, responsivos e **visualmente atrativos** para o Concurso Mobiliário Urbano da Prefeitura de São Paulo.

## 🎨 Características dos Templates

- **Design Responsivo**: Adaptável a diferentes dispositivos e clientes de email
- **Identidade Visual**: Cores e estilos consistentes com a marca da Prefeitura
- **Imagens Integradas**: Banner hero com imagem oficial da aplicação (`hero-b.png`)
- **Ícones Visuais**: Emojis e elementos gráficos para melhor experiência
- **Modularidade**: Componentes reutilizáveis para diferentes tipos de email
- **Acessibilidade**: Estrutura semântica e contraste adequado
- **Compatibilidade**: Funciona em clientes de email populares (Gmail, Outlook, etc.)
- **🆕 Preview Interativo**: Sistema de visualização e teste em tempo real
- **🔧 Envio Real**: Sistema funcional para envio de emails de teste

## 🖼️ Elementos Visuais Integrados

### **Banner Hero com Imagem Oficial**
- **Imagem de fundo**: `public/hero/pc/hero-b.png` (banner oficial da aplicação)
- **Overlay responsivo**: Mantém legibilidade do texto sobre a imagem
- **Gradientes**: Transições suaves entre cores oficiais
- **Sombras de texto**: Melhor contraste e legibilidade
- **🆕 Design Atualizado**: Imagem como plano de fundo do header com overlay para legibilidade

### **Cabeçalho Aprimorado**
- **Logo da Prefeitura**: Design circular com gradientes
- **Tipografia melhorada**: Fontes mais legíveis e hierarquia visual clara
- **Cores oficiais**: Gradientes usando as cores do projeto

### **Cards Informativos**
- **Ícones específicos**: Emojis relevantes para cada tipo de informação
- **Cores variadas**: Cada card tem uma cor única baseada no tema
- **Sombras e bordas**: Design moderno com profundidade visual
- **Layout responsivo**: Adaptável a diferentes tamanhos de tela

### **Rodapé Enriquecido**
- **Ícone decorativo**: Elemento visual central
- **Informações organizadas**: Endereço, CEP e portal em cards
- **Links funcionais**: URLs diretas para o portal oficial

## 🆕 Sistema de Preview Interativo

### **🆕 Funcionalidades do Preview**
- **Visualização em Tempo Real**: Veja como o email ficará antes de enviar
- **Configuração Dinâmica**: Altere dados e veja as mudanças instantaneamente
- **Teste de Envio**: Envie emails de teste para validar os templates
- **Download de HTML**: Baixe o código HTML para uso externo
- **Cópia de Código**: Copie o HTML para a área de transferência
- **🔧 Status SMTP**: Verificação da configuração do servidor de email
- **🎯 Seletor de Template**: Escolha qualquer template para teste independentemente do preview

### **Acesso ao Preview**
- **Rota**: `/email-preview` (apenas para usuários DEV/ADMIN)
- **Menu**: Adicionado ao menu administrativo com ícone 📧
- **Interface**: Três abas principais: "Preview dos Templates", "Testar Envio" e "Status SMTP"

### **Como Usar o Preview**
1. **Acesse**: `/email-preview` através do menu administrativo
2. **Selecione**: Escolha um template da lista disponível
3. **Configure**: Personalize os dados nos campos de configuração
4. **Visualize**: Veja o resultado em tempo real na área de preview
5. **Teste**: Use a aba "Testar Envio" para enviar emails de teste
6. **Exporte**: Copie ou baixe o HTML gerado
7. **🔧 Verifique**: Use a aba "Status SMTP" para verificar a configuração
8. **🎯 Escolha**: Use o seletor de template para testar diferentes tipos independentemente

## 🚀 Templates Disponíveis

### 1. Template Base Configurável
```typescript
gerarEmailTemplate({
  nome: "Nome do Destinatário",
  titulo: "Título Principal",
  subtitulo: "Subtítulo explicativo",
  conteudoPrincipal: "Conteúdo HTML principal",
  botaoTexto: "Texto do Botão",
  botaoUrl: "URL do botão",
  mostrarCards: true,
  cardsPersonalizados: [...]
})
```

### 2. Template de Confirmação de Inscrição
```typescript
templateConfirmacaoInscricao(nome: string)
```
- Confirma inscrição no concurso
- Inclui cards informativos com ícones 📋 e 📅
- Botão para acessar área do usuário

### 3. Template de Notificação Geral
```typescript
templateNotificacao(nome: string, titulo: string, mensagem: string)
```
- Para notificações personalizadas
- Conteúdo flexível e configurável

### 4. Template de Lembrete
```typescript
templateLembrete(nome: string, evento: string, data: string)
```
- Lembretes sobre eventos importantes
- Inclui data e descrição do evento
- Cards com ícones ⏰ e 📝

### 5. Template de Boas-vindas
```typescript
templateBoasVindas(nome: string)
```
- Mensagem de boas-vindas para novos participantes
- Cards informativos com ícones 🚀 e 💬

### 6. Template de Nova Dúvida ⭐ NOVO
```typescript
templateNovaDuvida(nome: string, email: string, pergunta: string)
```
- **Notifica a equipe administrativa** sobre novas dúvidas
- Inclui todos os detalhes da dúvida com ícones visuais 👤📧❓
- Cards informativos com ícones ⚡📚🔔
- Botão direto para o painel de dúvidas

## 🎨 Melhorias Visuais Implementadas

### **Banner Hero**
- ✅ Imagem de fundo `hero-b.png` integrada
- ✅ Overlay responsivo para legibilidade
- ✅ Gradientes e sombras de texto
- ✅ Layout adaptativo
- ✅ **🆕 Imagem como plano de fundo** com overlay para melhor legibilidade

### **Cabeçalho**
- ✅ Logo da Prefeitura com design circular
- ✅ Gradientes e sombras
- ✅ Tipografia melhorada
- ✅ Cores oficiais do projeto

### **Cards Informativos**
- ✅ Ícones específicos para cada tipo de informação
- ✅ Cores variadas baseadas no tema
- ✅ Sombras e bordas modernas
- ✅ Layout responsivo

### **Rodapé**
- ✅ Ícone decorativo central
- ✅ Informações organizadas em cards
- ✅ Links funcionais para o portal
- ✅ Design visual aprimorado

### **🆕 Sistema de Preview**
- ✅ Interface interativa para visualização
- ✅ Configuração dinâmica de dados
- ✅ Teste de envio de emails
- ✅ Exportação de HTML
- ✅ Integração com menu administrativo
- ✅ **🔧 Verificação de status SMTP**

## 📧 Configuração de Email

### Variáveis de Ambiente Necessárias

```env
# Configurações SMTP
EMAIL_FROM="naoresponda-mobiliariourbano@spurbanismo.sp.gov.br"
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app

# Email para notificações de dúvidas
MAIL_BCC=equipe-admin@spurbanismo.sp.gov.br

# URL base da aplicação (para imagens e links)
NEXT_PUBLIC_APP_URL=https://mobiliariourbano.prefeitura.sp.gov.br
```

### **Importante: Configuração de Imagens**
- **URL Base**: Configure `NEXT_PUBLIC_APP_URL` para que as imagens funcionem
- **Imagem do Banner**: `hero-b.png` é carregada automaticamente
- **Fallback**: Se a imagem não carregar, o email ainda funciona com o design base

### **🔧 Configuração SMTP Detalhada**

#### **Gmail (Recomendado para testes)**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app
```

**⚠️ Importante para Gmail:**
1. **Ative a verificação em duas etapas**
2. **Crie uma senha de aplicativo** (não use sua senha normal)
3. **Use a porta 587** com STARTTLS

#### **Outros Provedores**
```env
# Outlook/Hotmail
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587

# Yahoo
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587

# Provedor próprio
MAIL_HOST=mail.seudominio.com
MAIL_PORT=587
```

## 🔄 Uso Automático

### Notificação de Novas Dúvidas

Quando uma nova dúvida é criada através da API `/api/duvida`, o sistema automaticamente:

1. ✅ Salva a dúvida no banco de dados
2. 📧 Envia email de notificação para `MAIL_BCC`
3. 🖼️ Inclui imagem do banner oficial
4. 📋 Inclui todos os detalhes da dúvida com ícones visuais
5. 🔗 Fornece link direto para o painel administrativo

**Exemplo de uso:**
```typescript
// No serviço de dúvidas (services/duvidas.ts)
const duvida = await criarDuvida({ nome, email, pergunta });
// Email é enviado automaticamente para MAIL_BCC com design visual aprimorado
```

## 🎯 Casos de Uso

### Para Participantes
- Confirmação de inscrição com design visual atrativo
- Lembretes de eventos com ícones informativos
- Boas-vindas com cards visuais
- Notificações gerais com identidade visual consistente

### Para Equipe Administrativa
- **Notificações de novas dúvidas** com design profissional ⭐
- Alertas de sistema com elementos visuais
- Relatórios automáticos com identidade visual
- **🆕 Preview e teste de templates** antes do envio
- **🔧 Verificação de configuração SMTP** em tempo real

## 🛠️ Personalização

### Cores do Sistema
```typescript
const styles = {
  corPrimaria: '#A5942B',      // Dourado
  corSecundaria: '#F3F9E7',   // Verde claro
  corFundo: '#f9fafb',        // Cinza claro
  corTexto: '#3B2D3A',        // Marrom escuro
  corTextoSecundario: '#6b7280', // Cinza médio
  corDestaque: '#7874C1'      // Roxo
};
```

### **Adicionando Novos Templates**

1. Crie a função do template seguindo o padrão existente
2. Use os componentes modulares disponíveis
3. Inclua ícones relevantes nos cards
4. Teste em diferentes clientes de email
5. Documente o novo template aqui
6. **🆕 Adicione ao sistema de preview** para visualização

## 📱 Responsividade

Os templates incluem:
- Media queries para dispositivos móveis
- Classes CSS específicas para mobile
- Layout adaptativo para diferentes tamanhos de tela
- Imagens responsivas com fallbacks
- Texto centralizado em telas pequenas

## 🔍 Debugging

### Logs de Email
O sistema registra:
- ✅ Emails enviados com sucesso
- ⚠️ Configurações ausentes
- ❌ Erros de envio
- 🖼️ Status do carregamento de imagens

### Verificação de Configuração
```typescript
// Verificar se as imagens estão carregando
console.log('URL da imagem:', `${process.env.NEXT_PUBLIC_APP_URL}/hero/pc/hero-b.png`);

// Verificar configurações SMTP
if (!transporter) {
  console.warn("⚠️ Transporter SMTP não configurado");
}

if (!process.env.MAIL_BCC) {
  console.warn("⚠️ MAIL_BCC não configurado");
}
```

### **🔧 Debugging SMTP**
```typescript
// Verificar status da configuração
const response = await fetch('/api/email-teste/status');
const status = await response.json();
console.log('Status SMTP:', status);

// Testar conexão
const testResponse = await fetch('/api/email-teste/test-connection', {
  method: 'POST'
});
const testResult = await testResponse.json();
console.log('Teste de conexão:', testResult);
```

## 📚 Exemplos de Uso

### Envio Manual de Email
```typescript
import { transporter } from "@/lib/nodemailer";
import { templateNovaDuvida } from "@/app/api/cadastro/_utils/email-templates";

await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: "destinatario@exemplo.com",
  subject: "Assunto do Email",
  html: templateNovaDuvida("João", "joao@exemplo.com", "Minha dúvida...")
});
```

### Integração com Serviços
```typescript
// No serviço de dúvidas
async function criarDuvida(data) {
  const duvida = await db.duvida.create({ data });
  
  // Email é enviado automaticamente com design visual aprimorado
  // Não é necessário código adicional
  
  return duvida;
}
```

### **🆕 Uso do Sistema de Preview**
```typescript
// Acesse /email-preview para:
// 1. Visualizar todos os templates
// 2. Configurar dados de teste
// 3. Enviar emails de teste
// 4. Exportar HTML dos templates
// 5. Verificar status da configuração SMTP
// 6. 🎯 Escolher templates diferentes para teste
```

### **🎯 Seletor de Template para Teste**

#### **Funcionalidades Principais:**
- **Seleção Independente**: Escolha qualquer template para teste, independentemente do preview
- **Sincronização Automática**: Muda automaticamente quando você altera o template no preview
- **Campos Dinâmicos**: Os campos de entrada se ajustam ao template selecionado
- **6 Templates Disponíveis**: Todos os tipos de email podem ser testados

#### **Como Usar:**
1. **Acesse a aba "Testar Envio"**
2. **Use o seletor "Template para Teste"**
3. **Escolha qualquer template disponível**
4. **Configure os dados específicos do template**
5. **Envie o email de teste**

#### **Templates Disponíveis para Teste:**
- ✅ **Confirmação de Inscrição**: Com campos de nome
- ✅ **Boas-vindas**: Com campos de nome
- ✅ **Lembrete**: Com campos de nome, evento e data
- ✅ **Notificação Geral**: Com campos de nome, título e mensagem
- ✅ **Nova Dúvida**: Com campos de nome e pergunta
- ✅ **Template Personalizado**: Com campos configuráveis

#### **Vantagens do Seletor:**
- **Flexibilidade**: Teste qualquer template sem navegar entre abas
- **Eficiência**: Múltiplos testes em sequência rápida
- **Comparação**: Teste diferentes templates com os mesmos dados
- **Validação**: Verifique se todos os templates funcionam corretamente

### **🔧 Teste de Envio via API**
```typescript
// Enviar email de teste
const response = await fetch('/api/email-teste', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateType: 'confirmacao',
    emailDestino: 'teste@exemplo.com',
    nome: 'João Silva'
  })
});

const result = await response.json();
console.log('Resultado do envio:', result);
```

## 🚨 Troubleshooting

### Email não está sendo enviado
1. **Verifique as variáveis de ambiente SMTP** na aba "Status SMTP"
2. **Confirme se `MAIL_BCC` está configurado**
3. **Teste a conexão SMTP** usando o botão "Testar Conexão"
4. **Verifique os logs do console** do servidor
5. **Use a aba "Status SMTP"** para diagnóstico completo

### Imagens não aparecem
1. Configure `NEXT_PUBLIC_APP_URL` corretamente
2. Verifique se o arquivo `hero-b.png` existe em `public/hero/pc/`
3. Teste a URL da imagem no navegador
4. Verifique se o cliente de email suporta imagens externas

### Template não renderiza corretamente
1. Verifique a sintaxe HTML
2. Teste em diferentes clientes de email
3. Use ferramentas de validação HTML
4. Verifique compatibilidade CSS

### **🔧 Problemas com SMTP**
1. **Verifique a configuração** na aba "Status SMTP"
2. **Teste a conexão** usando o botão de teste
3. **Confirme as variáveis** de ambiente
4. **Verifique portas e firewall**
5. **Use senhas de aplicativo** para Gmail

### **🖼️ Problemas com Imagem do Banner**
1. **Configure NEXT_PUBLIC_APP_URL** no arquivo .env
2. **Verifique se a imagem existe** em `public/hero/pc/hero-b.png`
3. **Teste o acesso à imagem** usando o botão "Testar Imagem"
4. **Confirme a URL gerada** nos logs do console
5. **Verifique permissões** do arquivo de imagem

#### **Configuração da Imagem:**
```env
# Adicione ao arquivo .env
NEXT_PUBLIC_APP_URL=https://seudominio.com
```

#### **Estrutura de Arquivos:**
```
public/
  hero/
    pc/
      hero-b.png  # Imagem do banner
```

#### **Debug da Imagem:**
```typescript
// Verificar logs no console
console.log('🔍 Debug Banner Hero:', {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL,
  heroImageUrl: `${baseUrl}/hero/pc/hero-b.png`
});

// Testar via API
GET /api/email-teste/test-image
```

### **🆕 Problemas com o Preview**
1. Verifique se o usuário tem permissão DEV/ADMIN
2. Confirme se a rota `/email-preview` está acessível
3. Verifique se os componentes estão importados corretamente
4. Teste a funcionalidade de envio de teste
5. **Use a aba "Status SMTP"** para verificar configurações

## 🎉 Novidades da Versão Atual

### **Melhorias Visuais Implementadas:**
- 🖼️ **Imagem do Banner**: Integração com `hero-b.png` oficial
- 🎨 **Design Aprimorado**: Gradientes, sombras e bordas modernas
- 🔤 **Ícones Visuais**: Emojis específicos para cada tipo de informação
- 📱 **Responsividade**: Melhor adaptação a dispositivos móveis
- 🎯 **Identidade Visual**: Consistência com o design da aplicação
- **🆕 Banner Hero Redesenhado**: Imagem como plano de fundo com overlay para legibilidade

### **🆕 Nova Funcionalidade de Preview:**
- 👁️ **Preview Interativo**: Visualização em tempo real dos templates
- ⚙️ **Configuração Dinâmica**: Personalização de dados para teste
- 📧 **Teste de Envio**: Funcionalidade para enviar emails de teste
- 💾 **Exportação**: Download e cópia do código HTML
- 🔗 **Integração**: Menu administrativo com acesso direto
- 🎯 **Seletor de Template**: Escolha independente de templates para teste

### **🔧 Sistema de Envio Funcional:**
- ✅ **API Route dedicada** para envio de emails de teste
- ✅ **Verificação de status SMTP** em tempo real
- ✅ **Teste de conexão** para validação
- ✅ **Diagnóstico completo** de configurações
- ✅ **Logs detalhados** para debugging
- ✅ **🎯 Seletor de template** para testes flexíveis

### **Templates Atualizados:**
- ✅ Confirmação de Inscrição com ícones 📋📅
- ✅ Boas-vindas com ícones 🚀💬
- ✅ Lembretes com ícones ⏰📝
- ✅ Nova Dúvida com ícones 👤📧❓⚡📚🔔

---

**Última atualização**: Sistema de envio de emails funcional implementado com verificação de status SMTP, permitindo diagnóstico completo e teste de conexão em tempo real
