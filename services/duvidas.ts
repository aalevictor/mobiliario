import { db } from "@/lib/prisma";
import { verificaLimite, verificaPagina } from "@/lib/utils";
import { getCurrentUserForEmail } from "@/lib/email-logger";
import { templateNovaDuvidaCoordenacao, templateNovaDuvidaParticipante } from "@/app/api/cadastro/_utils/email-templates";
import { AuditLogger } from "@/lib/audit-logger";
import { NivelLog } from "@prisma/client";

async function criarDuvida(data: { pergunta: string, email: string, nome: string }) {
    const duvida = await db.duvida.create({ data });
    if (!duvida) throw new Error("Erro ao criar duvida");
    
    // Enviar email de notificação para a equipe administrativa
    const mailBcc = process.env.MAIL_BCC;
    const usuario = getCurrentUserForEmail();
        const response = await fetch(`${process.env.MAIL_API}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.MAIL_FROM || '',
                to: data.email,
                subject: "PEDIDO DE ESCLARECIMENTO PROCESSADO",
                html: templateNovaDuvidaParticipante(data.nome),
            }),
        });
        if (response.ok) {
            await AuditLogger.logApiRequest(
                `🔒 EMAIL ENVIADO: ${process.env.MAIL_FROM} para ${data.email}`,
                NivelLog.INFO,
                'email/info',
                'POST',
                usuario
            );
        } else {
            const error = new Error('Email não enviado');
            await AuditLogger.logError(
                `🚨 EMAIL CRÍTICO FALHOU: ${process.env.MAIL_FROM} para ${data.email}`,
                error instanceof Error ? error.stack : undefined,
                NivelLog.CRITICAL,
                'email/critical',
                'POST',
                usuario
            );
        }

    if (mailBcc) {
        const response = await fetch(`${process.env.MAIL_API}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.MAIL_FROM,
                to: mailBcc,
                subject: "PEDIDO DE ESCLARECIMENTO PROCESSADO",
                html: templateNovaDuvidaCoordenacao(data.nome, data.email, data.pergunta),
            }),
        });
        if (response.ok) {
            await AuditLogger.logApiRequest(
                `🔒 EMAIL ENVIADO: ${process.env.MAIL_FROM} para ${mailBcc}`,
                NivelLog.INFO,
                'email/info',
                'POST',
                usuario
            );
        } else {
            const error = new Error('Email não enviado');
            await AuditLogger.logError(
                `🚨 EMAIL CRÍTICO FALHOU: ${process.env.MAIL_FROM} para ${mailBcc}`,
                error instanceof Error ? error.stack : undefined,
                NivelLog.CRITICAL,
                'email/critical',
                'POST',
                usuario
            );
        }
    } else {
        console.warn("⚠️ Variável MAIL_BCC não configurada. Email de notificação não será enviado.");
    }
    
    return duvida;
}

async function responderDuvida(id: string, resposta: string) {
    const duvida = await buscarDuvida(id);
    if (!duvida) throw new Error("Duvida não encontrada");
    const respondida = await db.duvida.update({
        where: { id },
        data: { resposta },
    });
    if (!respondida) throw new Error("Erro ao responder pergunta");
    return respondida;
}

async function buscarDuvida(id: string) {
    const duvida = await db.duvida.findUnique({
        where: { id },
    });
    return duvida;
}

async function buscarDuvidas(
    pagina: number = 1,
    limite: number = 10,
    busca?: string,
) {
    [pagina, limite] = verificaPagina(pagina, limite);
    const searchParams = {
        ...(busca && {
            OR: [
                { pergunta: { contains: busca } },
                { resposta: { contains: busca } },
            ],
        }),
    };
    const total = await db.duvida.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, users: [] };
    [pagina, limite] = verificaLimite(pagina, limite, total);
    const usuarios = await db.duvida.findMany({
        where: searchParams,
        orderBy: { criadoEm: 'asc' },
        skip: (pagina - 1) * limite,
        take: limite,
    });
    return {
        total: +total,
        pagina: +pagina,
        limite: +limite,
        data: usuarios,
    };
}

export { criarDuvida, responderDuvida, buscarDuvida, buscarDuvidas }