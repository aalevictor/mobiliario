import { PrismaClient, NivelLog } from "@prisma/client";
import { AuditLogger } from "./audit-logger";

let prismaWithAudit: PrismaClient | null = null;

export function createPrismaWithAudit() {
  if (prismaWithAudit) {
    return prismaWithAudit;
  }

  const basePrisma = new PrismaClient();

  // Usar extensão para interceptar operações (substituto do $use deprecated)
  const prisma = basePrisma.$extends({
    query: {
      $allOperations: async ({ operation, model, args, query }) => {
        const start = Date.now();
        
        try {
          // Buscar dados anteriores para operações de UPDATE e DELETE
          let dadosAntes = null;
          if ((operation === 'update' || operation === 'delete' || operation === 'upsert') && args?.where) {
            try {
              //eslint-disable-next-line  @typescript-eslint/no-explicit-any
              dadosAntes = await (basePrisma as any)[model?.toLowerCase() || '']?.findUnique({
                where: args.where
              });
            } catch (error) {
              console.error('Erro ao buscar dados anteriores:', error);              // Se não conseguir buscar dados anteriores, continua sem eles
            }
          }

          // Executar a operação
          const result = await query(args);
          const duracao = Date.now() - start;

          // Buscar dados posteriores para operações que modificam dados
          let dadosDepois = null;
          if (operation === 'create' || operation === 'update' || operation === 'upsert') {
            dadosDepois = result;
          }

          // Registrar a operação no log de auditoria (exceto operações na própria tabela de logs)
          if (model !== 'LogAuditoria') {
            await AuditLogger.logDatabaseOperation(
              operation.toUpperCase(),
              model || 'UNKNOWN',
              getRecordId(result, { args }),
              dadosAntes,
              dadosDepois,
              getCurrentUser(),
              duracao
            );
          }

          return result;
        } catch (error) {
          console.error('Erro ao executar operação:', error);          
          // Registrar erro de banco de dados
          await AuditLogger.logError(
            `Erro na operação ${operation} na tabela ${model}: ${error}`,
            error instanceof Error ? error.stack : undefined,
            NivelLog.ERROR,
            undefined,
            undefined,
            getCurrentUser()
          );

          throw error;
        }
      }
    }
  });

  prismaWithAudit = prisma as unknown as PrismaClient;
  return prismaWithAudit;
}

//eslint-disable-next-line  @typescript-eslint/no-explicit-any
function getRecordId(result: any, params: any): string | undefined {
  if (!result) return undefined;
  
  // Para operações que retornam um objeto, pegar o ID
  if (result.id) return result.id.toString();
  
  // Para operações em massa, tentar pegar do where
  if (params.args?.where?.id) return params.args.where.id.toString();
  
  return undefined;
}

function getCurrentUser(): string | undefined {
  // Esta função deve ser implementada para retornar o usuário atual
  // Pode ser através de um context, session, ou outra forma de state management
  // Por enquanto retorna undefined, mas você pode adaptar conforme sua implementação
  return undefined;
}

// Export singleton instance
export const prismaAudit = createPrismaWithAudit();
