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
import { 
  templateConfirmacaoInscricao, 
  templateNotificacao, 
  templateLembrete, 
  templateBoasVindas,
  templateNovaDuvida,
  gerarEmailTemplate
} from "@/app/api/cadastro/_utils/email-templates";

interface EmailTesterProps {
  selectedTemplate: string;
}

export default function EmailTester({ selectedTemplate }: EmailTesterProps) {
  const [isSending, setIsSending] = useState(false);
  const [testData, setTestData] = useState({
    emailDestino: "",
    nome: "João Silva",
    evento: "Entrega de Documentos",
    data: "25 de março de 2025",
    titulo: "Resultado da Primeira Fase",
    mensagem: "Informamos que o resultado da primeira fase foi divulgado. Acesse nossa plataforma para verificar sua situação.",
    pergunta: "Gostaria de saber se posso participar do concurso mesmo sendo uma empresa de outro estado, ou se há alguma restrição geográfica para a participação."
  });

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateTemplateHTML = () => {
    switch (selectedTemplate) {
      case "confirmacao":
        return templateConfirmacaoInscricao(testData.nome);
      case "boas-vindas":
        return templateBoasVindas(testData.nome);
      case "lembrete":
        return templateLembrete(testData.nome, testData.evento, testData.data);
      case "notificacao":
        return templateNotificacao(testData.nome, testData.titulo, testData.mensagem);
      case "nova-duvida":
        return templateNovaDuvida(testData.nome, testData.emailDestino, testData.pergunta);
      case "personalizado":
        return gerarEmailTemplate({
          nome: testData.nome,
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
        });
      default:
        return "";
    }
  };

  const handleSendTestEmail = async () => {
    if (!testData.emailDestino) {
      toast.error("Por favor, insira um email de destino");
      return;
    }

    setIsSending(true);
    
    try {
      // Simular envio de email (em produção, isso seria uma chamada real para a API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const html = generateTemplateHTML();
      
      // Aqui você pode implementar o envio real do email
      // Por enquanto, apenas simulamos o sucesso
      toast.success("Email de teste enviado com sucesso!");
      
      // Log do HTML gerado para debugging
      console.log("HTML do template gerado:", html);
      
    } catch (error) {
      toast.error("Erro ao enviar email de teste");
      console.error("Erro:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getTemplateIcon = () => {
    switch (selectedTemplate) {
      case "confirmacao":
        return <UserCheck className="h-5 w-5" />;
      case "boas-vindas":
        return <Heart className="h-5 w-5" />;
      case "lembrete":
        return <Calendar className="h-5 w-5" />;
      case "notificacao":
        return <Bell className="h-5 w-5" />;
      case "nova-duvida":
        return <HelpCircle className="h-5 w-5" />;
      case "personalizado":
        return <Settings className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  const getTemplateDescription = () => {
    switch (selectedTemplate) {
      case "confirmacao":
        return "Email enviado após inscrição bem-sucedida";
      case "boas-vindas":
        return "Primeiro contato com novos participantes";
      case "lembrete":
        return "Lembretes sobre eventos e prazos";
      case "notificacao":
        return "Comunicações importantes sobre o concurso";
      case "nova-duvida":
        return "Notificação para equipe administrativa";
      case "personalizado":
        return "Template configurável com cards";
      default:
        return "Template selecionado";
    }
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
        {selectedTemplate === "lembrete" && (
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

        {selectedTemplate === "notificacao" && (
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

        {selectedTemplate === "nova-duvida" && (
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
      </CardContent>
    </Card>
  );
}
