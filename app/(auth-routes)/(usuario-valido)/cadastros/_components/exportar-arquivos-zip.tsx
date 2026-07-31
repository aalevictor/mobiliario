"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileArchive, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function ExportarArquivosZip() {
    const [isPending, startTransition] = useTransition();
    const handleExportar = async () => {
        startTransition(async () => {
            const response = await fetch(`/api/cadastro/exportar-arquivos-zip`);
            if (!response.ok) throw new Error('Erro ao exportar arquivos');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `arquivos-inscritos-${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }

    return (
        <DropdownMenuItem className='hover:opacity-80' onClick={handleExportar} disabled={isPending}>
            <FileArchive className='w-4 h-4' />
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Exportar Arquivos (ZIP)'}
        </DropdownMenuItem>
    )
}
