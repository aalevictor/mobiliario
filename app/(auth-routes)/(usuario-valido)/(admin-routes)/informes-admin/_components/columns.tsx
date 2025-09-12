/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Informe } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { redirect } from 'next/navigation';

export const columns: ColumnDef<Informe>[] = [
	{
		accessorKey: 'titulo',
		header: 'Título',
	},
	{
		accessorKey: 'subtitulo',
		header: 'Subtítulo',
	},
	{
		accessorKey: 'dataPublicacao',
		header: 'Data de Publicação',
        cell: ({ row }) => {
            const dataPublicacao = new Date(row.original.dataPublicacao);            
            return (
                <div className='flex items-center justify-center'>
                    <p>{dataPublicacao.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
                    })}</p>
                </div>
            );
        },
	},
	{
		accessorKey: 'publicado',
		header: () => <p className='text-center'>Status</p>,
		cell: ({ row }) => {
			const publicado = row.original.publicado;
			const dataPublicacao = new Date(row.original.dataPublicacao);
			const agora = new Date();
			const isAgendado = dataPublicacao > agora && publicado;
			const isPublicado = publicado && dataPublicacao <= agora;
			
			return (
				<div className='flex items-center justify-center'>
					{isAgendado ? (
						<Badge variant="secondary">Agendado</Badge>
					) : isPublicado ? (
						<Badge variant="default">Publicado</Badge>
					) : (
						<Badge variant="destructive">Rascunho</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => {
            return <div className='flex items-center justify-center gap-2'>
                <Button variant='outline' size="sm" onClick={() => {
                    redirect(`/informes-admin/${row.original.id}`);
                }}>
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>
		},
	},
];
