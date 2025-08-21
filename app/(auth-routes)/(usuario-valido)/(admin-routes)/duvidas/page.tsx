import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { Duvida } from '@prisma/client';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import { buscarDuvidas } from '@/services/duvidas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
		<div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-2">
		  <Card>
				<CardHeader>
				<CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Pedidos de esclarecimento
				</CardTitle>
				<CardDescription>
					Visualize, edite e gerencie todas os pedidos de esclarecimento
				</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardContent className='flex justify-between items-end max-md:flex-col max-md:gap-4'>
					<Filtros
						camposFiltraveis={[
							{
								nome: 'Busca',
								tag: 'busca',
								tipo: 0,
								placeholder: 'Digite parte da pergunta ou resposta',
							},
						]}
						className='max-md:w-full'
					/>
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
