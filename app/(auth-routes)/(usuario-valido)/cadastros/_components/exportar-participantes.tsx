"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download, Loader2 } from "lucide-react";
import { useTransition } from "react";

export interface IFiltrosCadastro {
    busca?: string;
    documentosEnviados?: string;
    projetosEnviados?: string;
    tipoInscricao?: string;
    avaliacao?: string;
}
export default function ExportarParticipantes({ filtros }: { filtros?: IFiltrosCadastro }) {
    const [isPending, startTransition] = useTransition();
    const handleExportar = async () => {
        startTransition(async () => {
            const response = await fetch(`/api/cadastro/relatorios-participantes?busca=${filtros?.busca}&documentosEnviados=${filtros?.documentosEnviados}&projetosEnviados=${filtros?.projetosEnviados}&tipoInscricao=${filtros?.tipoInscricao}&avaliacao=${filtros?.avaliacao}`);
            if (!response.ok) throw new Error('Erro ao exportar participantes');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cadastros-participantes-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }

    return (
        <DropdownMenuItem className='hover:opacity-80' onClick={handleExportar} disabled={isPending}>
            <Download className='w-4 h-4' />
            {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Exportar Participantes'}
        </DropdownMenuItem>
    )
}
