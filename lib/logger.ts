import { LogService, ICreateLog } from "@/services/logs";

/**
 * Utilitário para facilitar o uso do sistema de logs
 */
export class Logger {
  /**
   * Log de criação de entidade
   */
  static async logCriacao(
    entidade: string,
    entidadeId: string,
    dados: object,
    usuarioId?: string,
    ip?: string,
    userAgent?: string
  ) {
    try {
      await LogService.logCriacao(entidade, entidadeId, dados, usuarioId, ip, userAgent);
    } catch (error) {
      console.error("Erro ao criar log de criação:", error);
    }
  }

  /**
   * Log de atualização de entidade
   */
  static async logAtualizacao(
    entidade: string,
    entidadeId: string,
    dadosAntes: object,
    dadosDepois: object,
    usuarioId?: string,
    ip?: string,
    userAgent?: string
  ) {
    try {
      await LogService.logAtualizacao(entidade, entidadeId, dadosAntes, dadosDepois, usuarioId, ip, userAgent);
    } catch (error) {
      console.error("Erro ao criar log de atualização:", error);
    }
  }

  /**
   * Log de exclusão de entidade
   */
  static async logExclusao(
    entidade: string,
    entidadeId: string,
    dados: object,
    usuarioId?: string,
    ip?: string,
    userAgent?: string
  ) {
    try {
      await LogService.logExclusao(entidade, entidadeId, dados, usuarioId, ip, userAgent);
    } catch (error) {
      console.error("Erro ao criar log de exclusão:", error);
    }
  }

  /**
   * Log de erro
   */
  static async logErro(
    mensagem: string,
    erro: Error,
    contexto?: {
      entidade?: string;
      entidadeId?: string;
      usuarioId?: string;
      ip?: string;
      userAgent?: string;
    }
  ) {
    try {
      await LogService.logErro(mensagem, erro, contexto);
    } catch (logError) {
      console.error("Erro ao criar log de erro:", logError);
      console.error("Erro original:", erro);
    }
  }

  /**
   * Log de login
   */
  static async logLogin(
    usuarioId: string,
    sucesso: boolean,
    ip?: string,
    userAgent?: string
  ) {
    try {
      await LogService.logLogin(usuarioId, sucesso, ip, userAgent);
    } catch (error) {
      console.error("Erro ao criar log de login:", error);
    }
  }

  /**
   * Log customizado
   */
  static async logCustomizado(logData: ICreateLog) {
    try {
      await LogService.criarLog(logData);
    } catch (error) {
      console.error("Erro ao criar log customizado:", error);
    }
  }

  /**
   * Log de acesso a funcionalidades sensíveis
   */
  static async logAcesso(
    funcionalidade: string,
    usuarioId: string,
    sucesso: boolean,
    detalhes?: string,
    ip?: string,
    userAgent?: string
  ) {
    try {
      await LogService.criarLog({
        acao: "ACCESS",
        entidade: "FUNCIONALIDADE",
        entidadeId: funcionalidade,
        mensagem: `${sucesso ? "Acesso permitido" : "Acesso negado"} a ${funcionalidade}${detalhes ? `: ${detalhes}` : ""}`,
        nivel: sucesso ? "INFO" : "WARNING",
        usuarioId,
        ip,
        userAgent,
      });
    } catch (error) {
      console.error("Erro ao criar log de acesso:", error);
    }
  }

  /**
   * Log de operações em lote
   */
  static async logOperacaoLote(
    operacao: string,
    entidade: string,
    quantidade: number,
    usuarioId?: string,
    ip?: string,
    userAgent?: string
  ) {
    try {
      await LogService.criarLog({
        acao: "BATCH",
        entidade,
        mensagem: `${operacao} em lote: ${quantidade} registros processados`,
        nivel: "INFO",
        usuarioId,
        ip,
        userAgent,
      });
    } catch (error) {
      console.error("Erro ao criar log de operação em lote:", error);
    }
  }
}

/**
 * Função helper para capturar IP e User Agent de uma requisição
 */
export function capturarInfoRequisicao(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "desconhecido";
  
  const userAgent = request.headers.get("user-agent") || "desconhecido";
  
  return { ip, userAgent };
}

/**
 * Função helper para capturar IP e User Agent do contexto do Next.js
 */
export function capturarInfoContexto(context: { req: { headers: { "x-forwarded-for": string, "x-real-ip": string, "user-agent": string, connection: { remoteAddress: string } } } }) {
  const ip = context?.req?.headers?.["x-forwarded-for"] as string || 
             context?.req?.headers?.["x-real-ip"] as string || 
             context?.req?.headers?.connection?.remoteAddress as string ||
             "desconhecido" as string;
  
  const userAgent = context?.req?.headers?.["user-agent"] as string || "desconhecido" as string;
  
  return { ip, userAgent } as { ip: string, userAgent: string };
}
