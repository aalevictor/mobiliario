"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Send, 
  Mail, 
  UserCheck, 
  Bell, 
  Calendar, 
  Heart, 
  HelpCircle, 
  Settings,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import React from "react"; // Added missing import for React

interface EmailTesterProps {
  selectedTemplate: string;
}

const templateOptions = [
  {
    value: "confirmacao",
    label: "Confirmação de Inscrição",
    icon: UserCheck,
    description: "Email enviado após inscrição bem-sucedida"
  },
  {
    value: "boas-vindas",
    label: "Boas-vindas",
    icon: Heart,
    description: "Primeiro contato com novos participantes"
  },
  {
    value: "lembrete",
    label: "Lembrete",
    icon: Calendar,
    description: "Lembretes sobre eventos e prazos"
  },
  {
    value: "notificacao",
    label: "Notificação Geral",
    icon: Bell,
    description: "Comunicações importantes sobre o concurso"
  },
  {
    value: "nova-duvida",
    label: "Nova Dúvida",
    icon: HelpCircle,
    description: "Notificação para equipe administrativa"
  },
  {
    value: "personalizado",
    label: "Template Personalizado",
    icon: Settings,
    description: "Template configurável com cards"
  }
];

export default function EmailTester({ selectedTemplate }: EmailTesterProps) {
  const [isSending, setIsSending] = useState(false);
  const [testTemplate, setTestTemplate] = useState(selectedTemplate);
  const [testData, setTestData] = useState({
    emailDestino: "",
    nome: "João Silva",
    evento: "Entrega de Documentos",
    data: "25 de março de 2025",
    titulo: "Resultado da Primeira Fase",
    mensagem: "Informamos que o resultado da primeira fase foi divulgado. Acesse nossa plataforma para verificar sua situação.",
    pergunta: "Gostaria de saber se posso participar do concurso mesmo sendo uma empresa de outro estado, ou se há alguma restrição geográfica para a participação."
  });

  // Atualizar template de teste quando o template do preview mudar
  React.useEffect(() => {
    setTestTemplate(selectedTemplate);
  }, [selectedTemplate]);

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendTestEmail = async () => {
    if (!testData.emailDestino) {
      toast.error("Por favor, insira um email de destino");
      return;
    }

    setIsSending(true);
    
    try {
      // Preparar dados para envio
      const emailData = {
        templateType: testTemplate,
        emailDestino: testData.emailDestino,
        nome: testData.nome,
        evento: testData.evento,
        data: testData.data,
        titulo: testData.titulo,
        mensagem: testData.mensagem,
        pergunta: testData.pergunta
      };

      // Enviar email através da API route
      const response = await fetch('/api/email-teste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Email de teste enviado com sucesso!");
        console.log("✅ Email enviado:", result);
      } else {
        toast.error(`Erro ao enviar email: ${result.error}`);
        console.error("❌ Erro na API:", result);
      }
      
    } catch (error) {
      toast.error("Erro ao enviar email de teste");
      console.error("❌ Erro de rede:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getTemplateIcon = () => {
    const template = templateOptions.find(t => t.value === testTemplate);
    if (template) {
      const Icon = template.icon;
      return <Icon className="h-5 w-5" />;
    }
    return <Mail className="h-5 w-5" />;
  };

  const getTemplateDescription = () => {
    const template = templateOptions.find(t => t.value === testTemplate);
    return template ? template.description : "Template selecionado";
  };

  const getTemplateLabel = () => {
    const template = templateOptions.find(t => t.value === testTemplate);
    return template ? template.label : "Template";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTemplateIcon()}
          Testar Envio de Email
        </CardTitle>
        <CardDescription>
          {getTemplateDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Template */}
        <div>
          <Label htmlFor="template-select">Template para Teste</Label>
          <Select value={testTemplate} onValueChange={setTestTemplate}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Selecione um template" />
            </SelectTrigger>
            <SelectContent>
              {templateOptions.map((template) => {
                const Icon = template.icon;
                return (
                  <SelectItem key={template.value} value={template.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{template.label}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Template selecionado: <span className="font-medium">{getTemplateLabel()}</span>
          </p>
        </div>

        {/* Email de destino */}
        <div>
          <Label htmlFor="emailDestino">Email de Destino *</Label>
          <Input
            id="emailDestino"
            type="email"
            value={testData.emailDestino}
            onChange={(e) => handleInputChange('emailDestino', e.target.value)}
            placeholder="email@exemplo.com"
            className="mt-1"
          />
        </div>

        {/* Nome do destinatário */}
        <div>
          <Label htmlFor="nome">Nome do Destinatário</Label>
          <Input
            id="nome"
            type="text"
            value={testData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Nome completo"
            className="mt-1"
          />
        </div>

        {/* Campos específicos para cada template */}
        {testTemplate === "lembrete" && (
          <>
            <div>
              <Label htmlFor="evento">Evento</Label>
              <Input
                id="evento"
                type="text"
                value={testData.evento}
                onChange={(e) => handleInputChange('evento', e.target.value)}
                placeholder="Nome do evento"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="text"
                value={testData.data}
                onChange={(e) => handleInputChange('data', e.target.value)}
                placeholder="Data do evento"
                className="mt-1"
              />
            </div>
          </>
        )}

        {testTemplate === "notificacao" && (
          <>
            <div>
              <Label htmlFor="titulo">Título da Notificação</Label>
              <Input
                id="titulo"
                type="text"
                value={testData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Título da notificação"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                value={testData.mensagem}
                onChange={(e) => handleInputChange('mensagem', e.target.value)}
                placeholder="Conteúdo da mensagem"
                rows={3}
                className="mt-1"
              />
            </div>
          </>
        )}

        {testTemplate === "nova-duvida" && (
          <div>
            <Label htmlFor="pergunta">Pergunta</Label>
            <Textarea
              id="pergunta"
              value={testData.pergunta}
              onChange={(e) => handleInputChange('pergunta', e.target.value)}
              placeholder="Pergunta do participante"
              rows={3}
              className="mt-1"
            />
          </div>
        )}

        {/* Botão de envio */}
        <Button
          onClick={handleSendTestEmail}
          disabled={isSending || !testData.emailDestino}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Email de Teste
            </>
          )}
        </Button>

        {/* Informações adicionais */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <p className="font-medium mb-1">ℹ️ Informações:</p>
          <ul className="space-y-1">
            <li>• Este é um teste de envio usando o template selecionado</li>
            <li>• O email será enviado para o endereço especificado</li>
            <li>• Verifique a caixa de entrada e spam</li>
            <li>• Em produção, configure as variáveis SMTP corretamente</li>
          </ul>
        </div>

        {/* Status da configuração */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <p className="font-medium mb-1 text-blue-900 dark:text-blue-100">🔧 Status da Configuração:</p>
          <ul className="space-y-1 text-blue-800 dark:text-blue-200">
            <li>• API Route: <span className="font-mono">/api/email-teste</span></li>
            <li>• Método: POST</li>
            <li>• Validação: Servidor</li>
            <li>• Logs: Console do servidor</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
