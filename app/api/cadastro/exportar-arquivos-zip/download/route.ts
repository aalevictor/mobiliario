import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";
import { obterJob, removerJob } from "@/lib/zip-jobs";
import { readFile, unlink } from "fs/promises";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const isDev = await verificarPermissoes(session.user.id, ["DEV", "ADMIN"]);
    if (!isDev) {
        return NextResponse.json({ error: "Sem permissão para exportar arquivos" }, { status: 403 });
    }

    const jobId = request.nextUrl.searchParams.get('jobId');
    if (!jobId) {
        return NextResponse.json({ error: "jobId é obrigatório" }, { status: 400 });
    }

    const job = obterJob(jobId);
    if (!job || job.status !== 'concluido' || !job.caminhoArquivo) {
        return NextResponse.json({ error: "Arquivo ainda não está pronto" }, { status: 409 });
    }

    const caminhoArquivo = job.caminhoArquivo;
    removerJob(jobId);

    let zipBuffer: Buffer;
    try {
        zipBuffer = await readFile(caminhoArquivo);
    } catch (error) {
        console.error('Erro ao ler zip gerado:', error);
        return NextResponse.json({ error: "Erro ao ler o arquivo gerado" }, { status: 500 });
    }
    unlink(caminhoArquivo).catch(() => {});

    const filename = `arquivos-inscritos-${new Date().toISOString().split('T')[0]}.zip`;
    return new NextResponse(new Uint8Array(zipBuffer), {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
