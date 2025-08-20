import { db } from "@/lib/prisma";
import { verificaLimite, verificaPagina } from "@/lib/utils";
import { transporter } from "@/lib/nodemailer";
import { templateNovaDuvida } from "@/app/api/cadastro/_utils/email-templates";

async function criarDuvida(data: { pergunta: string, email: string, nome: string }) {
    const duvida = await db.duvida.create({ data });
    if (!duvida) throw new Error("Erro ao criar duvida");
    
    // Enviar email de notificação para a equipe administrativa
    try {
        if (transporter) {
            const mailBcc = process.env.MAIL_BCC;
            if (mailBcc) {
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || "naoresponda-mobiliariourbano@spurbanismo.sp.gov.br",
                    to: mailBcc, // Email principal
                    bcc: mailBcc, // Cópia oculta para backup
                    subject: "Nova Dúvida - Concurso Mobiliário Urbano 2025",
                    html: templateNovaDuvida(data.nome, data.email, data.pergunta),
                });
                console.log("✅ Email de notificação de nova dúvida enviado com sucesso");
            } else {
                console.warn("⚠️ Variável MAIL_BCC não configurada. Email de notificação não será enviado.");
            }
        } else {
            console.warn("⚠️ Transporter SMTP não configurado. Email de notificação não será enviado.");
        }
    } catch (error) {
        console.error("❌ Erro ao enviar email de notificação de nova dúvida:", error);
        // Não falha a criação da dúvida se o email falhar
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