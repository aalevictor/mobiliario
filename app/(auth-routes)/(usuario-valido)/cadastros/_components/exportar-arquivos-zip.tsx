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
                while (status === 'processando') {
                    await aguardar(1000);
                    const progressoResponse = await fetch(`/api/cadastro/exportar-arquivos-zip/progresso?jobId=${jobId}`);
                    if (!progressoResponse.ok) {
                        const erro = await progressoResponse.json().catch(() => null);
                        throw new Error(erro?.error || 'Erro ao acompanhar exportação');
                    }
                    const progresso: IProgresso = await progressoResponse.json();
                    status = progresso.status;
                    if (status === 'erro') {
                        throw new Error(progresso.erro || 'Erro ao gerar o arquivo ZIP');
                    }
                    const percentual = progresso.total > 0 ? Math.round((progresso.processado / progresso.total) * 100) : 100;
                    toast.loading(`Preparando arquivo ZIP... ${percentual}% (${progresso.processado}/${progresso.total})`, { id: toastId });
                }

                toast.loading('Baixando arquivo...', { id: toastId });
                const downloadResponse = await fetch(`/api/cadastro/exportar-arquivos-zip/download?jobId=${jobId}`);
                if (!downloadResponse.ok) {
                    const erro = await downloadResponse.json().catch(() => null);
                    throw new Error(erro?.error || 'Erro ao baixar arquivo');
                }
                const blob = await downloadResponse.blob();
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
