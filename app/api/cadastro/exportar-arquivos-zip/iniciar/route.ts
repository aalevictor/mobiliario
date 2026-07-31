import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ZipArchive } from "archiver";
import { existsSync } from "fs";
import { join, basename } from "path";
import { randomUUID } from "crypto";
import { criarJob, atualizarProgresso, concluirJob, falharJob } from "@/lib/zip-jobs";

const NOME_PASTA_TIPO: Record<string, string> = {
    DOC_ESPECIFICA: "Documentacao Especifica",
    PROJETOS: "Projetos",
    PROJETOS_2: "Projetos Fase 2",
};

export async function POST() {
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

    const arquivosParaZipar: { caminhoAbsoluto: string; nomeNoZip: string }[] = [];
    for (const cadastro of cadastros) {
        const pasta = cadastro.protocolo || `cadastro-${cadastro.id}`;
        for (const arquivo of cadastro.arquivos) {
            const caminhoAbsoluto = join(process.cwd(), arquivo.caminho);
            if (!existsSync(caminhoAbsoluto)) continue;
            const pastaTipo = NOME_PASTA_TIPO[arquivo.tipo] || arquivo.tipo;
            arquivosParaZipar.push({
                caminhoAbsoluto,
                nomeNoZip: `${pasta}/${pastaTipo}/${basename(arquivo.caminho)}`,
            });
        }
    }

    const jobId = randomUUID();
    criarJob(jobId, arquivosParaZipar.length);

    // Roda em segundo plano; o processo do servidor é de longa duração (não serverless),
    // então o job continua mesmo após esta resposta ser enviada. Progresso é consultado via /progresso.
    (async () => {
        try {
            const archive = new ZipArchive({ zlib: { level: 9 } });
            const chunks: Buffer[] = [];
            const zipPronto = new Promise<Buffer>((resolve, reject) => {
                archive.on('data', (chunk: Buffer) => chunks.push(chunk));
                archive.on('error', reject);
                archive.on('end', () => resolve(Buffer.concat(chunks)));
                archive.on('progress', (progress) => {
                    atualizarProgresso(jobId, progress.entries.processed, progress.entries.total);
                });
            });

            for (const { caminhoAbsoluto, nomeNoZip } of arquivosParaZipar) {
                archive.file(caminhoAbsoluto, { name: nomeNoZip });
            }
            archive.finalize();

            const zipBuffer = await zipPronto;
            concluirJob(jobId, zipBuffer);
        } catch (error) {
            console.error('Erro ao gerar zip de arquivos:', error);
            falharJob(jobId, 'Erro ao gerar o arquivo ZIP');
        }
    })();

    return NextResponse.json({ jobId, total: arquivosParaZipar.length });
}
