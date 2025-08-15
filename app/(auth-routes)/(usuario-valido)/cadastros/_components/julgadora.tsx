/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ICadastro } from '../page';
import { TipoArquivo } from '.prisma/client';
import ModalJulgadora from './modal-julgadora';
import { Button } from '@/components/ui/button';

export const julgadoraColumns: ColumnDef<ICadastro>[] = [
	{
		accessorKey: 'id',
		header: 'Inscrição',
	},
	{
		accessorKey: 'projetos',
		header: () => <p className='text-center'>Projetos</p>,
		cell: ({ row }) => {
			const projetos = row.original.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.PROJETOS);
			const projetos_length = projetos?.length || 0;
			return (
				<div className='flex items-center justify-end'>
					<Badge variant='default'>
						{projetos_length > 0 ? projetos_length : 'Nenhum'} arquivo{projetos_length > 1 ? 's' : ''}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'acoes',
		header: "",
		cell: ({ row }) => {
			return (
				<div className='flex items-center justify-end'>
					<ModalJulgadora cadastro={row.original}>
						<Button size='sm' variant='outline'>Avaliar projetos</Button>
					</ModalJulgadora>
				</div>
			);
		},
	},
];

