/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros, TiposFiltros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import { buscarArquivos, buscarTiposArquivoDisponiveis, IArquivoListagem } from '@/services/arquivos';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { verificarPermissoes } from '@/services/usuarios';
import ExportarArquivosZip from './_components/exportar-arquivos-zip';

export default async function ArquivosSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Arquivos searchParams={searchParams} />
		</Suspense>
	);
}

interface IPaginadoArquivo {
	pagina: number;
	limite: number;
	total: number;
	data: IArquivoListagem[];
}

async function Arquivos({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const session = await auth();
	if (!session) return redirect('/');
	if (!await verificarPermissoes(session.user.id, ['DEV']))
		return redirect('/meu-cadastro');

	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '', tipos = '' } = await searchParams;
	let dados: IArquivoListagem[] = [];

	try {
		const data = await buscarArquivos(
			+pagina,
			+limite,
			tipos as string,
			busca as string,
		);
		if (data) {
			const paginado = data as IPaginadoArquivo;
			pagina = paginado.pagina || 1;
			limite = paginado.limite || 10;
			total = paginado.total || 0;
			dados = paginado.data || [];
		}
	} catch (error) {
		console.error(error);
	}

	let tiposDisponiveis: { value: string; label: string }[] = [];
	try {
		tiposDisponiveis = await buscarTiposArquivoDisponiveis();
	} catch (error) {
		console.error(error);
	}

	return (
		<div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Arquivos
					</CardTitle>
					<CardDescription>
						Visualize e filtre todos os arquivos enviados pelos participantes
					</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardContent className='flex flex-col lg:flex-row lg:items-end justify-between gap-4'>
					<Filtros
						camposFiltraveis={[
							{
								nome: 'Busca',
								tag: 'busca',
								tipo: TiposFiltros.TEXTO,
								placeholder: 'Nome, e-mail, protocolo ou arquivo',
							},
							{
								nome: 'Tipo de Arquivo',
								tag: 'tipos',
								tipo: TiposFiltros.MULTISELECT,
								placeholder: 'Todos os tipos',
								valores: tiposDisponiveis,
							},
						]}
					/>
					<ExportarArquivosZip filtros={{ tipos: tipos as string, busca: busca as string }} />
				</CardContent>
			</Card>
			<Card className='pt-0'>
				<CardContent className='p-0'>
					<div className='w-full rounded-lg overflow-hidden mb-4'>
						<DataTable
							columns={columns}
							data={dados || []}
						/>
					</div>
				</CardContent>
				<Separator />
				{dados && dados.length > 0 && (
					<CardFooter>
						<Pagination
							total={+total}
							pagina={+pagina}
							limite={+limite}
						/>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
