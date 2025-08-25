import { transporter } from "@/lib/nodemailer";
import { AuditLogger } from "@/lib/audit-logger";
import { NivelLog } from "@prisma/client";
import type { SendMailOptions } from "nodemailer";

export interface EmailLogData {
  to: string;
  subject: string;
  template?: string;
  usuario?: string;
  tentativa?: number;
}

export class EmailLogger {
  /**
   * Envia email com logging automático de sucesso/erro
   */
  static async sendMail(
    mailOptions: SendMailOptions,
    logData: EmailLogData
  ) {
    const startTime = Date.now();
    
    try {
      // Verificar se transporter está configurado
      if (!transporter) {
        const error = "Transporter SMTP não configurado";
        
        await AuditLogger.logError(
          `Falha no envio de email: ${error}`,
          undefined,
          NivelLog.ERROR,
          'email/send',
          'POST',
          logData.usuario,
          undefined,
          undefined
        );
        
        console.error(`❌ Email não enviado para ${logData.to}: ${error}`);
        throw new Error(error);
      }

      // Tentar enviar o email
      const info = await transporter.sendMail(mailOptions);
      const duracao = Date.now() - startTime;

      // Log de sucesso
      await AuditLogger.log({
        tipo: 'SYSTEM',
        nivel: NivelLog.INFO,
        operacao: 'EMAIL_SENT',
        tabela: 'email_system',
        dadosDepois: {
          to: logData.to,
          subject: logData.subject,
          template: logData.template,
          messageId: info.messageId,
          tentativa: logData.tentativa || 1
        },
        usuario: logData.usuario,
        duracao,
        endpoint: 'email/send',
        metodo: 'POST'
      });

      console.log(`✅ Email enviado com sucesso para ${logData.to}: ${logData.subject}`, {
        messageId: info.messageId,
        duracao: `${duracao}ms`
      });

      return info;

    } catch (error) {
      const duracao = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      
      // Log de erro
      await AuditLogger.logError(
        `Falha no envio de email para ${logData.to}: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
        NivelLog.ERROR,
        'email/send',
        'POST',
        logData.usuario,
        undefined,
        undefined
      );

      // Log adicional com detalhes do email
      await AuditLogger.log({
        tipo: 'ERROR',
        nivel: NivelLog.ERROR,
        operacao: 'EMAIL_FAILED',
        tabela: 'email_system',
        dadosAntes: {
          to: logData.to,
          subject: logData.subject,
          template: logData.template,
          tentativa: logData.tentativa || 1
        },
        erro: errorMessage,
        stackTrace: error instanceof Error ? error.stack : undefined,
        usuario: logData.usuario,
        duracao,
        endpoint: 'email/send',
        metodo: 'POST'
      });

      console.error(`❌ Falha no envio de email para ${logData.to}:`, {
        subject: logData.subject,
        error: errorMessage,
        duracao: `${duracao}ms`,
        tentativa: logData.tentativa || 1
      });

      throw error;
    }
  }

  /**
   * Envia email com retry automático e logging
   */
  static async sendMailWithRetry(
    mailOptions: SendMailOptions,
    logData: EmailLogData,
    maxTentativas: number = 3
  ) {
    let ultimoErro: Error | null = null;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        const logDataComTentativa = { ...logData, tentativa };
        return await this.sendMail(mailOptions, logDataComTentativa);
      } catch (error) {
        ultimoErro = error instanceof Error ? error : new Error("Erro desconhecido");
        
        if (tentativa < maxTentativas) {
          const delayMs = tentativa * 2000; // 2s, 4s, 6s...
          
          console.warn(`⚠️ Tentativa ${tentativa}/${maxTentativas} falhou para ${logData.to}. Tentando novamente em ${delayMs}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    await AuditLogger.logError(
      `Falha definitiva no envio de email para ${logData.to} após ${maxTentativas} tentativas: ${ultimoErro?.message}`,
      ultimoErro?.stack,
      NivelLog.CRITICAL, // Falha após retry é crítica
      'email/send-retry',
      'POST',
      logData.usuario
    );

    throw ultimoErro;
  }

  /**
   * Wrapper para emails críticos (com retry e log crítico)
   */
  static async sendCriticalMail(
    mailOptions: SendMailOptions,
    logData: EmailLogData
  ) {
    try {
      return await this.sendMailWithRetry(mailOptions, logData, 3);
    } catch (error) {
      // Email crítico que falhou após retry - notificar admin
      await AuditLogger.logError(
        `🚨 EMAIL CRÍTICO FALHOU: ${logData.subject} para ${logData.to}`,
        error instanceof Error ? error.stack : undefined,
        NivelLog.CRITICAL,
        'email/critical',
        'POST',
        logData.usuario
      );
      
      throw error;
    }
  }

  /**
   * Wrapper para emails não-críticos (falha silenciosa com log)
   */
  static async sendOptionalMail(
    mailOptions: SendMailOptions,
    logData: EmailLogData
  ): Promise<boolean> {
    try {
      await this.sendMail(mailOptions, logData);
      return true;
    } catch (error) {
      console.error(error);
      // Log do erro mas não falha a operação principal
      console.warn(`⚠️ Email opcional falhou para ${logData.to}: ${logData.subject}`);
      return false;
    }
  }
}

/**
 * Helper para extrair dados do usuário atual (se disponível)
 */
export function getCurrentUserForEmail(): string | undefined {
  // Esta função pode ser expandida para pegar usuário do contexto/session
  // Por enquanto retorna undefined
  return undefined;
}
