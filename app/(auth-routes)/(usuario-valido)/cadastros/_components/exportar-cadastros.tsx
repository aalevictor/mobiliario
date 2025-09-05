"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function ExportarCadastros() {
    const [isPending, startTransition] = useTransition();
    const handleExportar = async () => {
        startTransition(async () => {
            const response = await fetch('/api/cadastro/relatorios');
            if (!response.ok) throw new Error('Erro ao exportar cadastros');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cadastros-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }

    return (
        <Button className='hover:opacity-80' onClick={handleExportar} disabled={isPending}>
            <Download className='w-4 h-4' />
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Exportar Cadastros'}
        </Button>
    )
}
