"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileArchive, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface IProgresso {
    status: 'processando' | 'concluido' | 'erro';
    processado: number;
    total: number;
    erro?: string;
}

const aguardar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function ExportarArquivosZip() {
    const [isPending, startTransition] = useTransition();

    const handleExportar = async () => {
        startTransition(async () => {
            const toastId = toast.loading('Preparando arquivo ZIP... 0%');
            try {
                const inicioResponse = await fetch('/api/cadastro/exportar-arquivos-zip/iniciar', { method: 'POST' });
                if (!inicioResponse.ok) {
                    const erro = await inicioResponse.json().catch(() => null);
                    throw new Error(erro?.error || 'Erro ao iniciar exportação');
                }
                const { jobId, total } = await inicioResponse.json();

                if (total === 0) {
                    toast.info('Nenhum arquivo encontrado para exportar', { id: toastId });
                    return;
                }

                let status: IProgresso['status'] = 'processando';
                let falhasConsecutivas = 0;
                while (status === 'processando') {
                    await aguardar(1000);
                    let progresso: IProgresso;
                    try {
                        const progressoResponse = await fetch(`/api/cadastro/exportar-arquivos-zip/progresso?jobId=${jobId}`);
                        if (!progressoResponse.ok) {
                            const erro = await progressoResponse.json().catch(() => null);
                            throw new Error(erro?.error || 'Erro ao acompanhar exportação');
                        }
                        progresso = await progressoResponse.json();
                        falhasConsecutivas = 0;
                    } catch (erroConsulta) {
                        // Tolera soluços transitórios (rede/proxy) sem abortar a exportação inteira
                        falhasConsecutivas++;
                        if (falhasConsecutivas >= 5) throw erroConsulta;
                        continue;
                    }
                    status = progresso.status;
                    if (status === 'erro') {
                        throw new Error(progresso.erro || 'Erro ao gerar o arquivo ZIP');
                    }
                    const percentual = progresso.total > 0 ? Math.round((progresso.processado / progresso.total) * 100) : 100;
                    toast.loading(`Preparando arquivo ZIP... ${percentual}% (${progresso.processado}/${progresso.total})`, { id: toastId });
                }

                // Baixa via fetch (não via navegação direta): disparar a.click() num link para a
                // URL do servidor muito tempo depois do clique original é tratado como "download
                // automático" e pode ser bloqueado silenciosamente pelo navegador. Clicar num link
                // blob: (dados já em memória) não sofre esse bloqueio.
                const downloadResponse = await fetch(`/api/cadastro/exportar-arquivos-zip/download?jobId=${jobId}`);
                if (!downloadResponse.ok) {
                    const erro = await downloadResponse.json().catch(() => null);
                    throw new Error(erro?.error || 'Erro ao baixar arquivo');
                }

                const contentLength = Number(downloadResponse.headers.get('Content-Length')) || 0;
                const reader = downloadResponse.body?.getReader();
                const chunks: Uint8Array[] = [];
                let recebido = 0;

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        if (!value) continue;
                        chunks.push(value);
                        recebido += value.length;
                        const mensagem = contentLength > 0
                            ? `Baixando arquivo... ${Math.round((recebido / contentLength) * 100)}%`
                            : `Baixando arquivo... ${(recebido / (1024 * 1024)).toFixed(1)}MB`;
                        toast.loading(mensagem, { id: toastId });
                    }
                } else {
                    chunks.push(new Uint8Array(await downloadResponse.arrayBuffer()));
                }

                const blob = new Blob(chunks as BlobPart[], { type: 'application/zip' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `arquivos-inscritos-${new Date().toISOString().split('T')[0]}.zip`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('Download concluído', { id: toastId });
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Erro ao exportar arquivos', { id: toastId });
            }
        });
    }

    return (
        <DropdownMenuItem className='hover:opacity-80' onClick={handleExportar} disabled={isPending}>
            <FileArchive className='w-4 h-4' />
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Exportar Arquivos (ZIP)'}
        </DropdownMenuItem>
    )
}
