import { db } from "@/lib/prisma";
import { verificaLimite, verificaPagina } from "@/lib/utils";

async function criarDuvida(data: { pergunta: string, email: string, nome: string }) {
    const duvida = await db.duvida.create({ data });
    if (!duvida) throw new Error("Erro ao criar duvida");
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