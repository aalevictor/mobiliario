import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { buscarArquivosParaExportacaoZip } from "@/services/arquivos";
import { NextRequest, NextResponse } from "next/server";
import { ZipArchive } from "archiver";
import { existsSync, createWriteStream } from "fs";
import { mkdir, unlink } from "fs/promises";
import { join, basename } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { criarJob, atualizarProgresso, concluirJob, falharJob } from "@/lib/zip-jobs";

const NOME_PASTA_TIPO: Record<string, string> = {
    DOC_ESPECIFICA: "Documentacao Especifica",
    PROJETOS: "Projetos",
    PROJETOS_2: "Projetos Fase 2",
};

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const isDev = await verificarPermissoes(session.user.id, ["DEV"]);
    if (!isDev) {
        return NextResponse.json({ error: "Sem permissão para exportar arquivos" }, { status: 403 });
    }

    const extensoes = request.nextUrl.searchParams.get('extensoes') || undefined;
    const busca = request.nextUrl.searchParams.get('busca') || undefined;

    const arquivosEncontrados = await buscarArquivosParaExportacaoZip(extensoes, busca);

    const arquivosParaZipar: { caminhoAbsoluto: string; nomeNoZip: string }[] = [];
    for (const arquivo of arquivosEncontrados) {
        const caminhoAbsoluto = join(process.cwd(), arquivo.caminho);
        if (!existsSync(caminhoAbsoluto)) continue;
        const pasta = arquivo.cadastro.protocolo || `cadastro-${arquivo.cadastro.id}`;
        const pastaTipo = NOME_PASTA_TIPO[arquivo.tipo] || arquivo.tipo;
        arquivosParaZipar.push({
            caminhoAbsoluto,
            nomeNoZip: `${pasta}/${pastaTipo}/${basename(arquivo.caminho)}`,
        });
    }

    const jobId = randomUUID();
    criarJob(jobId, arquivosParaZipar.length);

    // Roda em segundo plano; o processo do servidor é de longa duração (não serverless),
    // então o job continua mesmo após esta resposta ser enviada. Progresso é consultado via /progresso.
    // O zip é escrito direto em disco (em vez de acumulado em memória) para não travar o
    // processo com um Buffer gigante na hora de fechar o arquivo.
    (async () => {
        const tempDir = join(tmpdir(), 'moburb-zip-exports');
        const tempFilePath = join(tempDir, `${jobId}.zip`);
        try {
            await mkdir(tempDir, { recursive: true });
            const archive = new ZipArchive({ zlib: { level: 6 } });
            const writeStream = createWriteStream(tempFilePath);

            const zipPronto = new Promise<void>((resolve, reject) => {
                writeStream.on('close', resolve);
                writeStream.on('error', reject);
                archive.on('error', reject);
                archive.on('progress', (progress) => {
                    atualizarProgresso(jobId, progress.entries.processed, progress.entries.total);
                });
            });

            archive.pipe(writeStream);
            for (const { caminhoAbsoluto, nomeNoZip } of arquivosParaZipar) {
                archive.file(caminhoAbsoluto, { name: nomeNoZip });
            }
            archive.finalize();

            await zipPronto;
            concluirJob(jobId, tempFilePath);
        } catch (error) {
            console.error('Erro ao gerar zip de arquivos:', error);
            falharJob(jobId, 'Erro ao gerar o arquivo ZIP');
            unlink(tempFilePath).catch(() => {});
        }
    })();

    return NextResponse.json({ jobId, total: arquivosParaZipar.length });
}
