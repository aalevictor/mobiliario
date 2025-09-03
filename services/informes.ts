import { db } from "@/lib/prisma";
import { verificaLimite, verificaPagina } from "@/lib/utils";

export async function listarInformes() {
    const agora = new Date();
    const informes = await db.informe.findMany({
        orderBy: { dataPublicacao: 'desc' },
        where: { 
            publicado: true,
            dataPublicacao: {
                lte: agora,
            },
        },
        include: {
            links: true,
            arquivos: true,
        },
    });
    return informes;
}

export async function buscarInforme(id: string) {
    const informe = await db.informe.findUnique({
        where: { id },
        include: {
            links: true,
            arquivos: true,
        },
    });
    return informe;
}

export async function buscarInformes(
    pagina: number = 1,
    limite: number = 10,
    busca?: string,
) {
    [pagina, limite] = verificaPagina(pagina, limite);
    const searchParams = {
        ...(busca && {
            OR: [
                { titulo: { contains: busca } },
                { subtitulo: { contains: busca } },
                { conteudo: { contains: busca } },
            ],
        }),
    };
    const total = await db.informe.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, users: [] };
    [pagina, limite] = verificaLimite(pagina, limite, total);
    const informes = await db.informe.findMany({
        where: searchParams,
        orderBy: { dataPublicacao: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
    });
    return {
        total: +total,
        pagina: +pagina,
        limite: +limite,
        data: informes,
    };
}