"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function ExportarAvaliacoesBasico() {
    const [isPending, startTransition] = useTransition();
    const handleExportar = async () => {
        startTransition(async () => {
            const response = await fetch(`/api/cadastro/relatorios-avaliacoes-basico`);
            if (!response.ok) throw new Error('Erro ao exportar avaliações básico');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `avaliacoes-basico-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }

    return (
        <DropdownMenuItem className='hover:opacity-80' onClick={handleExportar} disabled={isPending}>
            <Download className='w-4 h-4' />
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Exportar Avaliações Básico'}
        </DropdownMenuItem>
    )
}
