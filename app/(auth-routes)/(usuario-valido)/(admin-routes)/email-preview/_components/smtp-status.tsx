"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings,
  RefreshCw,
  Mail,
  Server
} from "lucide-react";
import { toast } from "sonner";

interface SMTPStatus {
  configured: boolean;
  transporter: boolean;
  variables: {
    host: boolean;
    port: boolean;
    user: boolean;
    pass: boolean;
  };
  testResult?: {
    success: boolean;
    message: string;
    error?: string;
  };
  imageTest?: {
    accessible: boolean;
    url: string;
    envVar: string;
  };
}

export default function SMTPStatus() {
  const [status, setStatus] = useState<SMTPStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const checkSMTPStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email-teste/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Erro ao verificar status SMTP:", error);
      setStatus({
        configured: false,
        transporter: false,
        variables: {
          host: false,
          port: false,
          user: false,
          pass: false
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSMTPConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/email-teste/test-connection', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (response.ok) {
        setStatus(prev => prev ? {
          ...prev,
          testResult: {
            success: true,
            message: "Conexão SMTP testada com sucesso!"
          }
        } : null);
      } else {
        setStatus(prev => prev ? {
          ...prev,
          testResult: {
            success: false,
            message: "Falha no teste de conexão",
            error: data.error
          }
        } : null);
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setStatus(prev => prev ? {
        ...prev,
        testResult: {
          success: false,
          message: "Erro ao testar conexão",
          error: "Erro de rede"
        }
      } : null);
    } finally {
      setIsTesting(false);
    }
  };

  const testImageAccess = async () => {
    try {
      const response = await fetch('/api/email-teste/test-image');
      const data = await response.json();
      
      if (response.ok) {
        console.log("🔍 Teste de imagem:", data);
        
        // Atualizar status com informações da imagem
        setStatus(prev => prev ? {
          ...prev,
          imageTest: {
            accessible: data.debug.imageAccessible,
            url: data.debug.heroImageUrl,
            envVar: data.debug.envVar
          }
        } : null);
        
        if (data.debug.imageAccessible) {
          toast.success("✅ Imagem do banner acessível!");
        } else {
          toast.error("❌ Imagem do banner não acessível");
        }
      }
    } catch (error) {
      console.error("❌ Erro ao testar imagem:", error);
      toast.error("❌ Erro ao testar acesso à imagem");
    }
  };

  useEffect(() => {
    checkSMTPStatus();
  }, []);

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status da Configuração SMTP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (configured: boolean) => {
    if (configured) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = (configured: boolean) => {
    if (configured) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Configurado</Badge>;
    }
    return <Badge variant="destructive">Não Configurado</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Status da Configuração SMTP
        </CardTitle>
        <CardDescription>
          Verifique o status da configuração de email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status geral */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status Geral:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.configured)}
            {getStatusBadge(status.configured)}
          </div>
        </div>

        {/* Status do transporter */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Transporter:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(status.transporter)}
            <Badge variant={status.transporter ? "default" : "destructive"}>
              {status.transporter ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </div>

        {/* Variáveis de ambiente */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Variáveis de Ambiente:</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>MAIL_HOST:</span>
              {getStatusIcon(status.variables.host)}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>MAIL_PORT:</span>
              {getStatusIcon(status.variables.port)}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>MAIL_USER:</span>
              {getStatusIcon(status.variables.user)}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>MAIL_PASS:</span>
              {getStatusIcon(status.variables.pass)}
            </div>
          </div>
        </div>

        {/* Resultado do teste */}
        {status.testResult && (
          <div className={`p-3 rounded-md ${
            status.testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20' 
              : 'bg-red-50 dark:bg-red-900/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(status.testResult.success)}
              <span className={`text-sm font-medium ${
                status.testResult.success 
                  ? 'text-green-900 dark:text-green-100' 
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {status.testResult.success ? 'Teste Bem-sucedido' : 'Teste Falhou'}
              </span>
            </div>
            <p className={`text-xs ${
              status.testResult.success 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {status.testResult.message}
            </p>
            {status.testResult.error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono">
                Erro: {status.testResult.error}
              </p>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            onClick={checkSMTPStatus}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Verificar Status
          </Button>
          
          <Button
            onClick={testSMTPConnection}
            disabled={isTesting || !status.configured}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {isTesting ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Testar Conexão
          </Button>
        </div>

        {/* Teste de Imagem */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Imagem do Banner:</span>
            <Button
              onClick={testImageAccess}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Testar Imagem
            </Button>
          </div>
          
          {status.imageTest && (
            <div className={`p-3 rounded-md ${
              status.imageTest.accessible 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(status.imageTest.accessible)}
                <span className={`text-sm font-medium ${
                  status.imageTest.accessible 
                    ? 'text-green-900 dark:text-green-100' 
                    : 'text-red-900 dark:text-red-100'
                }`}>
                  {status.imageTest.accessible ? 'Imagem Acessível' : 'Imagem Não Acessível'}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <p className={`${
                  status.imageTest.accessible 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  <strong>URL:</strong> {status.imageTest.url}
                </p>
                <p className={`${
                  status.imageTest.accessible 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  <strong>Variável de Ambiente:</strong> {status.imageTest.envVar || 'Não configurada'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Informações de ajuda */}
        {!status.configured && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Configuração Necessária
              </span>
            </div>
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              Configure as seguintes variáveis no arquivo <code className="bg-yellow-100 px-1 rounded">.env</code>:
            </p>
            <ul className="text-xs text-yellow-800 dark:text-yellow-200 mt-2 space-y-1">
              <li>• <code>MAIL_HOST</code> - Servidor SMTP</li>
              <li>• <code>MAIL_PORT</code> - Porta SMTP (587, 465, etc.)</li>
              <li>• <code>MAIL_USER</code> - Usuário SMTP</li>
              <li>• <code>MAIL_PASS</code> - Senha SMTP</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
