/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ICadastro } from '../page';
import { TipoArquivo } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Eye, X } from 'lucide-react';
import { toast } from 'sonner';

async function liberarAvaliacao(cadastroId: number) {
	const result = await fetch(`/api/cadastro/${cadastroId}/liberar`, {
		method: 'PATCH',
	});
	if (result.ok) {
		toast.success('Avaliação liberada com sucesso!');
		window.location.reload();
	} else {
		const error = await result.json();
		toast.error(error.error || 'Erro ao liberar avaliação');
	}
}

async function revogarLiberacao(cadastroId: number) {
	const result = await fetch(`/api/cadastro/${cadastroId}/revogar-liberacao`, {
		method: 'PATCH',
	});
	if (result.ok) {
		toast.success('Liberação revogada com sucesso!');
		window.location.reload();
	} else {
		const error = await result.json();
		toast.error(error.error || 'Erro ao revogar liberação');
	}
}

export const administradoraColumns: ColumnDef<ICadastro>[] = [
	{
		accessorKey: 'acoes',
		header: "",
		cell: ({ row }) => {
			// const indeferido = !!row.original.avaliacao_licitadora && row.original.avaliacao_licitadora.aprovado === false;
			// const liberado = !!row.original.avaliacao_licitadora?.liberadoAval;
			return (
				<div className='flex justify-end gap-2'>
					{/* {!liberado && !indeferido && (
						<Button title='Liberar cadastro para avaliação' size='sm' variant='outline' className='cursor-pointer' onClick={async () => row.original.id && await liberarAvaliacao(+row.original.id)}>
							<Check className='w-4 h-4' />
						</Button>
					)}
					{liberado && !indeferido && (
						<Button title='Revogar liberação de avaliação' size='sm' variant='destructive' className='cursor-pointer' onClick={async () => row.original.id && await revogarLiberacao(+row.original.id)}>
							<X className='w-4 h-4' />
						</Button>
					)} */}
					<Link href={`/cadastros/${row.original.id}`} title='Visualizar dados'>
						<Button size='sm' variant='outline' className='cursor-pointer'><Eye className='w-4 h-4' /></Button>
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const avaliado = !!row.original.avaliacao_licitadora;
			// const indeferido = row.original.avaliacao_licitadora && row.original.avaliacao_licitadora.aprovado === false;
			// const arquivos = row.original.arquivos?.filter((arquivo) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho?.split("/").pop()?.startsWith("RECURSO-")) || [];
			const liberado = !!row.original.avaliacao_licitadora?.liberadoAval;
			const habilitacao = row.original.arquivos?.filter((arquivo) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho?.split("/").pop()?.startsWith("HABILITACAO")) || [];
			return (
				<div className='flex gap-2'>
					<Badge variant={avaliado ? liberado ? 'default' : 'destructive' : 'outline'}>
						{avaliado ? (liberado ? 'Deferido' : 'Indeferido') : 'Aguardando avaliação'}
					</Badge>
					{habilitacao.length > 0 && (
						<Badge variant='default'>
							{habilitacao.length}
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'data_inscricao',
		header: 'Data de inscrição',
		cell: ({ row }) => {
			return row.original.criadoEm ? `${new Date(row.original.criadoEm).toLocaleDateString('pt-BR')}, ${new Date(row.original.criadoEm).toLocaleTimeString('pt-BR')}` : 'N/A';
		},
	},
	{
		accessorKey: 'id',
		header: '#',
	},
	{
		accessorKey: 'protocolo',
		header: 'ID',
	},
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	// {
	// 	accessorKey: 'email',
	// 	header: 'E-mail',
	// },
	// {
	// 	accessorKey: 'carteira',
	// 	header: 'Carteira',
	// 	cell: ({ row }) => {
	// 		return `${row.original.carteira_tipo} - ${row.original.carteira_numero}`;
	// 	},
	// },
	// {
	// 	accessorKey: 'equipe',
	// 	header: 'Equipe',
	// 	cell: ({ row }) => {
	// 		return row.original.participantes?.length && row.original.participantes?.length > 0 ? 'Sim' : 'Não';
	// 	},	
	// },
	// {
	// 	accessorKey: 'participantes',
	// 	header: () => <p className='text-center'>Participantes</p>,
	// 	cell: ({ row }) => {
	// 		const participantes_length = row.original.participantes?.length || 0;
	// 		return (
	// 			<div className='flex items-center justify-center'>
	// 				<Badge variant='default'>
	// 					{participantes_length > 0 ? participantes_length : 'Nenhum'} participante{participantes_length > 1 ? 's' : ''}
	// 				</Badge>
	// 			</div>
	// 		);
	// 	},
	// },
	// {
	// 	accessorKey: 'doc_especifica',
	// 	header: () => <p className='text-center'>Documentação específica</p>,
	// 	cell: ({ row }) => {
	// 		const doc_especifica = row.original.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA);
	// 		const doc_especifica_length = doc_especifica?.length || 0;
	// 		return (
	// 			<div className='flex items-center justify-center'>
	// 				<Badge variant='default'>
	// 					{doc_especifica_length > 0 ? doc_especifica_length : 'Nenhum'} arquivo{doc_especifica_length > 1 ? 's' : ''}
	// 				</Badge>
	// 			</div>
	// 		);
	// 	},
	// },
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
