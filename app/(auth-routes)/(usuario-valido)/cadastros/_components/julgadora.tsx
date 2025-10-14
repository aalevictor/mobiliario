/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ICadastro } from '../page';
import { TipoArquivo } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const julgadoraColumns: ColumnDef<ICadastro>[] = [
	{
		accessorKey: 'acoes',
		header: "",
		cell: ({ row }) => {
			return (
				<div className='flex'>
					<Link href={`/cadastros/${row.original.id}`}>
						<Button size='sm' variant='outline' className='cursor-pointer'>Ver dados</Button>
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: 'status',
		header: () => <div className='flex items-center justify-center'>Status</div>,
		cell: ({ row }) => {
			const avaliacao = row.original.avaliacoes_julgadora && row.original.avaliacoes_julgadora[0];
			let media = 0;
			if (avaliacao) {
				const { linhaTematica1, linhaTematica2, linhaTematica3, conceitoProjetual, atendimentoNormas, insercaoUrbana, qualidadeFuncional, exequibilidade, economicidade, qualidadeGrafica } = avaliacao
				media = ((linhaTematica1 || 0) + (linhaTematica2 || 0) + (linhaTematica3 || 0) + (conceitoProjetual || 0) + (atendimentoNormas || 0) + (insercaoUrbana || 0) + (qualidadeFuncional || 0) + (exequibilidade || 0) + (economicidade || 0) + (qualidadeGrafica || 0)) / 10;
			}
			const status = !!avaliacao && media > 0;
			return (
				<div className='flex items-center justify-center'>
					<Badge variant={status ? 'default' : 'destructive'}>
						{status ? 'Avaliado' : 'Aguardando avaliação'}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'media',
		header: () => <div className='flex items-center justify-center'>Média</div>,
		cell: ({ row }) => {
			const avaliacao = row.original.avaliacoes_julgadora && row.original.avaliacoes_julgadora[0];
			let media = 0;
			if (avaliacao) {
				const { linhaTematica1, linhaTematica2, linhaTematica3, conceitoProjetual, atendimentoNormas, insercaoUrbana, qualidadeFuncional, exequibilidade, economicidade, qualidadeGrafica } = avaliacao
				media = ((linhaTematica1 || 0) + (linhaTematica2 || 0) + (linhaTematica3 || 0) + (conceitoProjetual || 0) + (atendimentoNormas || 0) + (insercaoUrbana || 0) + (qualidadeFuncional || 0) + (exequibilidade || 0) + (economicidade || 0) + (qualidadeGrafica || 0)) / 10;
			}
			return (
				<div className='flex items-center justify-center'>
					<Badge variant={media ? 'default' : 'destructive'}>
						{media.toFixed(2) || "-"}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'protocolo',
		header: 'Inscrição',
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
];

