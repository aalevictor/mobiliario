/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ICadastro } from '../page';
import { TipoArquivo } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const administradoraColumns: ColumnDef<ICadastro>[] = [
	{
		accessorKey: 'protocolo',
		header: 'Protocolo',
	},
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
	{
		accessorKey: 'carteira',
		header: 'Carteira',
		cell: ({ row }) => {
			return `${row.original.carteira_tipo} - ${row.original.carteira_numero}`;
		},
	},
	{
		accessorKey: 'equipe',
		header: 'Equipe',
		cell: ({ row }) => {
			return row.original.equipe ? 'Sim' : 'Não';
		},	
	},
	{
		accessorKey: 'participantes',
		header: () => <p className='text-center'>Participantes</p>,
		cell: ({ row }) => {
			const participantes_length = row.original.participantes?.length || 0;
			return (
				<div className='flex items-center justify-center'>
					<Badge variant='default'>
						{participantes_length > 0 ? participantes_length : 'Nenhum'} participante{participantes_length > 1 ? 's' : ''}
					</Badge>
				</div>
			);
		},
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
		accessorKey: 'projetos',
		header: () => <p className='text-center'>Projetos</p>,
		cell: ({ row }) => {
			const projetos = row.original.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.PROJETOS);
			const projetos_length = projetos?.length || 0;
			return (
				<div className='flex items-center justify-center'>
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
				<div className='flex items-center justify-end gap-2'>
					<Link href={`/cadastros/${row.original.id}`}>
						<Button size='sm' variant='outline' className='cursor-pointer'>Ver dados</Button>
					</Link>
				</div>
			);
		},
	},
];
