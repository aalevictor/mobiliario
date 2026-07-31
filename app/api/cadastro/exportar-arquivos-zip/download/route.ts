import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";
import { obterJob, removerJob } from "@/lib/zip-jobs";
import { createReadStream } from "fs";
import { unlink } from "fs/promises";
import { Readable } from "stream";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const isDev = await verificarPermissoes(session.user.id, ["DEV"]);
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

    const fileStream = createReadStream(caminhoArquivo);
    fileStream.on('close', () => {
        unlink(caminhoArquivo).catch(() => {});
    });

    const filename = `arquivos-inscritos-${new Date().toISOString().split('T')[0]}.zip`;
    return new NextResponse(Readable.toWeb(fileStream) as unknown as ReadableStream, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
