"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  templateConfirmacaoInscricao, 
  templateNotificacao, 
  templateLembrete, 
  templateBoasVindas,
  templateNovaDuvida,
  gerarEmailTemplate
} from "@/app/api/cadastro/_utils/email-templates";
import { 
  Mail, 
  UserCheck, 
  Bell, 
  Calendar, 
  Heart, 
  HelpCircle, 
  Settings,
  Download,
  Eye,
  Copy
} from "lucide-react";
import { toast } from "sonner";
import EmailTester from "./_components/email-tester";

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("confirmacao");
  const [previewData, setPreviewData] = useState({
    nome: "João Silva",
    email: "joao.silva@empresa.com.br",
    pergunta: "Gostaria de saber se posso participar do concurso mesmo sendo uma empresa de outro estado, ou se há alguma restrição geográfica para a participação.",
    evento: "Entrega de Documentos",
    data: "25 de março de 2025",
    titulo: "Resultado da Primeira Fase",
    mensagem: "Informamos que o resultado da primeira fase foi divulgado. Acesse nossa plataforma para verificar sua situação."
  });

  const templates = [
    {
      id: "confirmacao",
      nome: "Confirmação de Inscrição",
      descricao: "Email enviado após inscrição bem-sucedida",
      icone: UserCheck,
      template: () => templateConfirmacaoInscricao(previewData.nome)
    },
    {
      id: "boas-vindas",
      nome: "Boas-vindas",
      descricao: "Primeiro contato com novos participantes",
      icone: Heart,
      template: () => templateBoasVindas(previewData.nome)
    },
    {
      id: "lembrete",
      nome: "Lembrete",
      descricao: "Lembretes sobre eventos e prazos",
      icone: Calendar,
      template: () => templateLembrete(previewData.nome, previewData.evento, previewData.data)
    },
    {
      id: "notificacao",
      nome: "Notificação Geral",
      descricao: "Comunicações importantes sobre o concurso",
      icone: Bell,
      template: () => templateNotificacao(previewData.nome, previewData.titulo, previewData.mensagem)
    },
    {
      id: "nova-duvida",
      nome: "Nova Dúvida",
      descricao: "Notificação para equipe administrativa",
      icone: HelpCircle,
      template: () => templateNovaDuvida(previewData.nome, previewData.email, previewData.pergunta)
    },
    {
      id: "personalizado",
      nome: "Template Personalizado",
      descricao: "Template configurável com cards",
      icone: Settings,
      template: () => gerarEmailTemplate({
        nome: previewData.nome,
        titulo: "Atualização Importante",
        subtitulo: "Novas diretrizes publicadas",
        conteudoPrincipal: `
          <p>Prezados participantes,</p>
          <p>Informamos que foram publicadas novas diretrizes para o Concurso Mobiliário Urbano 2025.</p>
          <p>As principais mudanças incluem:</p>
          <ul style="margin: 20px 0; padding-left: 20px;">
            <li>Prorrogação do prazo de inscrição</li>
            <li>Novos critérios de avaliação</li>
            <li>Atualização do cronograma</li>
          </ul>
        `,
        mostrarCards: true,
        cardsPersonalizados: [
          {
            icone: '📅',
            titulo: 'Prazo Estendido',
            descricao: 'Inscrições prorrogadas até 30 de abril de 2025'
          },
          {
            icone: '📋',
            titulo: 'Documentação',
            descricao: 'Verifique se seus documentos estão atualizados'
          },
          {
            icone: '💬',
            titulo: 'Suporte',
            descricao: 'Entre em contato em caso de dúvidas'
          }
        ],
        botaoTexto: 'Ver Novas Diretrizes',
        botaoUrl: 'https://exemplo.com/diretrizes'
      })
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleCopyHTML = async () => {
    if (currentTemplate) {
      const html = currentTemplate.template();
      try {
        await navigator.clipboard.writeText(html);
        toast.success("HTML copiado para a área de transferência!");
      } catch (error) {
        toast.error("Erro ao copiar HTML");
      }
    }
  };

  const handleDownloadHTML = () => {
    if (currentTemplate) {
      const html = currentTemplate.template();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${selectedTemplate}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Template baixado com sucesso!");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Preview dos Templates de Email
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize, teste e envie todos os templates de email disponíveis no sistema
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview dos Templates</TabsTrigger>
          <TabsTrigger value="test">Testar Envio</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar com seleção de templates */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Templates Disponíveis
                  </CardTitle>
                  <CardDescription>
                    Selecione um template para visualizar o preview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {templates.map((template) => {
                    const Icon = template.icone;
                    return (
                      <Button
                        key={template.id}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        className="w-full justify-start gap-3 h-auto py-3"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{template.nome}</div>
                          <div className="text-xs opacity-70">{template.descricao}</div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Configurações do preview */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações do Preview
                  </CardTitle>
                  <CardDescription>
                    Personalize os dados para testar os templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nome</label>
                    <input
                      type="text"
                      value={previewData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Nome do destinatário"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      value={previewData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  {selectedTemplate === "lembrete" && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Evento</label>
                        <input
                          type="text"
                          value={previewData.evento}
                          onChange={(e) => handleInputChange('evento', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Nome do evento"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Data</label>
                        <input
                          type="text"
                          value={previewData.data}
                          onChange={(e) => handleInputChange('data', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Data do evento"
                        />
                      </div>
                    </>
                  )}

                  {selectedTemplate === "notificacao" && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Título</label>
                        <input
                          type="text"
                          value={previewData.titulo}
                          onChange={(e) => handleInputChange('titulo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Título da notificação"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mensagem</label>
                        <textarea
                          value={previewData.mensagem}
                          onChange={(e) => handleInputChange('mensagem', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          rows={3}
                          placeholder="Conteúdo da mensagem"
                        />
                      </div>
                    </>
                  )}

                  {selectedTemplate === "nova-duvida" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pergunta</label>
                      <textarea
                        value={previewData.pergunta}
                        onChange={(e) => handleInputChange('pergunta', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                        placeholder="Pergunta do participante"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview do email */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Preview do Template
                      </CardTitle>
                      <CardDescription>
                        {currentTemplate?.nome} - Visualização em tempo real
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyHTML}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copiar HTML
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadHTML}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Badge variant="secondary">Preview</Badge>
                        <span>•</span>
                        <span>{currentTemplate?.nome}</span>
                        <span>•</span>
                        <span>Responsivo</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4">
                      <div 
                        className="email-preview"
                        dangerouslySetInnerHTML={{ 
                          __html: currentTemplate?.template() || '' 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações do template */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Informações do Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Características</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Design responsivo para mobile e desktop</li>
                        <li>• Integração com imagem oficial do banner</li>
                        <li>• Ícones visuais específicos para cada tipo</li>
                        <li>• Cores oficiais da Prefeitura de São Paulo</li>
                        <li>• Compatível com clientes de email populares</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Uso</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• <strong>Confirmação:</strong> Após inscrição</li>
                        <li>• <strong>Boas-vindas:</strong> Primeiro contato</li>
                        <li>• <strong>Lembretes:</strong> Eventos e prazos</li>
                        <li>• <strong>Notificações:</strong> Comunicações gerais</li>
                        <li>• <strong>Nova Dúvida:</strong> Para equipe administrativa</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="test" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Testador de email */}
            <div>
              <EmailTester selectedTemplate={selectedTemplate} />
            </div>

            {/* Informações sobre o teste */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Como Testar os Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">📧 Envio de Teste</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use esta funcionalidade para enviar emails de teste usando os templates selecionados.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">🔧 Configuração</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Configure as variáveis SMTP no arquivo .env</li>
                      <li>• Verifique se MAIL_BCC está configurado</li>
                      <li>• Teste com diferentes endereços de email</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">📱 Validação</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Verifique a caixa de entrada e spam</li>
                      <li>• Teste em diferentes clientes de email</li>
                      <li>• Valide a responsividade em dispositivos móveis</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      💡 Dica Importante
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Sempre teste os templates antes de usar em produção. 
                      Verifique se as imagens carregam corretamente e se o layout 
                      está responsivo em diferentes dispositivos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
