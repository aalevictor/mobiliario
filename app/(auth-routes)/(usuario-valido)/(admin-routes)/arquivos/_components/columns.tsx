/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { NOME_TIPO_ARQUIVO, IArquivoListagem, extrairExtensaoArquivo } from '@/lib/tipo-arquivo';
import DownloadArquivoButton from './download-arquivo-button';

function formatarTamanho(bytes?: number | null): string {
	if (!bytes) return '-';
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const columns: ColumnDef<IArquivoListagem>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome do Arquivo',
		cell: ({ row }) => row.original.caminho?.split('/').pop() || row.original.caminho,
	},
	{
		accessorKey: 'formato',
		header: 'Tipo de Arquivo',
		cell: ({ row }) => (
			<Badge variant='secondary'>
				{extrairExtensaoArquivo(row.original.caminho)}
			</Badge>
		),
	},
	{
		accessorKey: 'tipo',
		header: 'Categoria',
		cell: ({ row }) => (
			<Badge variant='default'>
				{NOME_TIPO_ARQUIVO[row.original.tipo] || row.original.tipo}
			</Badge>
		),
	},
	{
		accessorKey: 'protocolo',
		header: 'Protocolo',
		cell: ({ row }) => row.original.cadastro?.protocolo || '-',
	},
	{
		accessorKey: 'participante',
		header: 'Enviado por',
		cell: ({ row }) => row.original.cadastro?.nome || '-',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
		cell: ({ row }) => row.original.cadastro?.email || '-',
	},
	{
		accessorKey: 'tamanho',
		header: 'Tamanho',
		cell: ({ row }) => formatarTamanho(row.original.tamanho),
	},
	{
		accessorKey: 'criadoEm',
		header: 'Enviado em',
		cell: ({ row }) => row.original.criadoEm
			? new Date(row.original.criadoEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
			: 'N/A',
	},
	{
		accessorKey: 'acoes',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => (
			<div className='flex items-center justify-center gap-2'>
				<DownloadArquivoButton
					cadastroId={row.original.cadastro.id}
					arquivoId={row.original.id}
					nomeArquivo={row.original.caminho?.split('/').pop() || row.original.caminho}
				/>
				<Link href={`/cadastros/${row.original.cadastro.id}`} title='Visualizar cadastro'>
					<Button size='sm' variant='outline'>
						<Eye className='w-4 h-4' />
					</Button>
				</Link>
			</div>
		),
	},
];
