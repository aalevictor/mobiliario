export type ZipJobStatus = 'processando' | 'concluido' | 'erro';

export interface ZipJob {
    status: ZipJobStatus;
    processado: number;
    total: number;
    buffer?: Buffer;
    erro?: string;
    criadoEm: number;
}

const jobs = new Map<string, ZipJob>();

const TTL_MS = 30 * 60 * 1000;

function limparJobsExpirados() {
    const agora = Date.now();
    for (const [id, job] of jobs) {
        if (agora - job.criadoEm > TTL_MS) jobs.delete(id);
    }
}

export function criarJob(id: string, total: number) {
    limparJobsExpirados();
    jobs.set(id, { status: 'processando', processado: 0, total, criadoEm: Date.now() });
}

export function atualizarProgresso(id: string, processado: number, total: number) {
    const job = jobs.get(id);
    if (!job) return;
    job.processado = processado;
    job.total = total;
}

export function concluirJob(id: string, buffer: Buffer) {
    const job = jobs.get(id);
    if (!job) return;
    job.status = 'concluido';
    job.buffer = buffer;
}

export function falharJob(id: string, erro: string) {
    const job = jobs.get(id);
    if (!job) return;
    job.status = 'erro';
    job.erro = erro;
}

export function obterJob(id: string): ZipJob | undefined {
    return jobs.get(id);
}

export function removerJob(id: string) {
    jobs.delete(id);
}
