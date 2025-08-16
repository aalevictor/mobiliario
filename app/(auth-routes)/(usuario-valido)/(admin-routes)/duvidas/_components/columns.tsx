'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Duvida } from '@prisma/client';
import ModalPergunta from '@/components/modal-pergunta';

export const columns: ColumnDef<Duvida>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
	{
		accessorKey: 'pergunta',
		header: () => <p className='text-center'>Pergunta</p>,
		cell: ({ row }) => {
            const pergunta = row.original.pergunta.length > 100 ? `${row.original.pergunta.substring(0, 100)}...` : row.original.pergunta;
			return (
				<p className='text-center' title={row.original.pergunta}>
                    {pergunta}
				</p>
			);
		},
	},
	{
		accessorKey: 'resposta',
		header: () => <p className='text-center'>Respondida</p>,
		cell: ({ row }) => {
			const respondida = row.original.resposta && row.original.resposta.length > 0;
			return (
				<div className='flex items-center justify-center'>
					<Badge variant={`${respondida ? 'default' : 'destructive'}`}>
						{respondida ? 'Sim' : 'Não'}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => {
			return (
				<div
					className='flex gap-2 items-center justify-center'
					key={row.id}
                >
                    <ModalPergunta duvida={row.original} />
				</div>
			);
		},
	},
];