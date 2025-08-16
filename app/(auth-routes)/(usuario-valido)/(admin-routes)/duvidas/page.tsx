import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { Duvida } from '@prisma/client';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import { buscarDuvidas } from '@/services/duvidas';

export default async function DuvidasSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Duvidas searchParams={searchParams} />
		</Suspense>
	);
}

interface IPaginadoDuvida {
    pagina: number;
    limite: number;
    total: number;
    data: Duvida[];
}

async function Duvidas({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = ''} = await searchParams;
	let dados: Duvida[] = [];

	// const session = await auth();
	// if (session && session.user) {
	try {
        const data = await buscarDuvidas(
            +pagina,
            +limite,
            busca as string,
        );
        if (data) {
            const paginado = data as IPaginadoDuvida;
            pagina = paginado.pagina || 1;
            limite = paginado.limite || 10;
            total = paginado.total || 0;
            dados = paginado.data || [];
        }
        const paginado = data as IPaginadoDuvida;
        dados = paginado.data || [];
	} catch (error) {
		console.error(error);
	}
	// }

	return (
		<div className=' w-full px-8 relative pb-20 md:pb-14 h-full md:container mx-auto py-10'>
			<h1 className='text-xl md:text-4xl font-bold'>Perguntas</h1>
			<div className='flex flex-col max-w-md mx-auto md:max-w-full gap-3 my-5 w-full'>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'Digite parte da pergunta ou resposta',
						},
					]}
				/>
				<DataTable
					columns={columns}
					data={dados || []}
				/>
				{dados && dados.length > 0 && (
					<Pagination
						total={+total}
						pagina={+pagina}
						limite={+limite}
					/>
				)}
			</div>
		</div>
	);
}
