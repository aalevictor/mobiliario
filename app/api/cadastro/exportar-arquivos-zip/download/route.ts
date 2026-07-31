import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";
import { obterJob, removerJob } from "@/lib/zip-jobs";

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
    if (!job || job.status !== 'concluido' || !job.buffer) {
        return NextResponse.json({ error: "Arquivo ainda não está pronto" }, { status: 409 });
    }

    const filename = `arquivos-inscritos-${new Date().toISOString().split('T')[0]}.zip`;
    const zipBuffer = job.buffer;
    removerJob(jobId);

    return new NextResponse(new Uint8Array(zipBuffer), {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
