import { auth } from "@/auth";
import { verificarPermissoes } from "@/services/usuarios";
import { NextRequest, NextResponse } from "next/server";
import { obterJob } from "@/lib/zip-jobs";

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
    if (!job) {
        return NextResponse.json({ error: "Job não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
        status: job.status,
        processado: job.processado,
        total: job.total,
        erro: job.erro,
    });
}
