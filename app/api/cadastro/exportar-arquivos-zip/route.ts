import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZipArchive } from "archiver";
import { existsSync } from "fs";
import { join, basename } from "path";
import { Readable } from "stream";

const NOME_PASTA_TIPO: Record<string, string> = {
    DOC_ESPECIFICA: "Documentacao Especifica",
    PROJETOS: "Projetos",
    PROJETOS_2: "Projetos Fase 2",
};

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const isDev = await verificarPermissoes(session.user.id, ["DEV"]);
    if (!isDev) {
        return NextResponse.json({ error: "Sem permissão para exportar arquivos" }, { status: 403 });
    }

    const cadastros = await db.cadastro.findMany({
        where: { arquivos: { some: {} } },
        select: {
            id: true,
            protocolo: true,
            arquivos: { select: { caminho: true, tipo: true } },
        },
    });

    const archive = new ZipArchive({ zlib: { level: 9 } });

    for (const cadastro of cadastros) {
        const pasta = cadastro.protocolo || `cadastro-${cadastro.id}`;
        for (const arquivo of cadastro.arquivos) {
            const caminhoAbsoluto = join(process.cwd(), arquivo.caminho);
            if (!existsSync(caminhoAbsoluto)) continue;
            const pastaTipo = NOME_PASTA_TIPO[arquivo.tipo] || arquivo.tipo;
            archive.file(caminhoAbsoluto, {
                name: `${pasta}/${pastaTipo}/${basename(arquivo.caminho)}`,
            });
        }
    }

    archive.finalize();

    const filename = `arquivos-inscritos-${new Date().toISOString().split('T')[0]}.zip`;
    return new NextResponse(Readable.toWeb(archive) as unknown as ReadableStream, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
