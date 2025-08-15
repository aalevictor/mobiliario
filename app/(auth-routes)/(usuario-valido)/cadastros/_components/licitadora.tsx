/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ICadastro } from '../page';
import { TipoArquivo } from '.prisma/client';
import ModalLicitadora from './modal-licitadora';
import { Button } from '@/components/ui/button';

export const licitadoraColumns: ColumnDef<ICadastro>[] = [
	{
		accessorKey: 'id',
		header: 'Inscrição',
	},
	{
		accessorKey: 'doc_especifica',
		header: () => <p className='text-center'>Documentação específica</p>,
		cell: ({ row }) => {
			const doc_especifica = row.original.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA);
			const doc_especifica_length = doc_especifica?.length || 0;
			return (
				<div className='flex items-center justify-center'>
					<Badge variant='default'>
						{doc_especifica_length > 0 ? doc_especifica_length : 'Nenhum'} arquivo{doc_especifica_length > 1 ? 's' : ''}
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
					<ModalLicitadora cadastro={row.original}>
						<Button size='sm'  variant='outline'>Avaliar Documentos</Button>
					</ModalLicitadora>
				</div>
			);
		},
	},
];
