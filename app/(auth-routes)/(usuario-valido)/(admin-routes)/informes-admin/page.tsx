/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import { ArquivoInforme, Usuario, Link as LinkInforme } from '@prisma/client';
import { retornaPermissao } from '@/services/usuarios';
import { auth } from '@/auth';
import { redirect, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { buscarInformes } from '@/services/informes';
import Link from 'next/link';
import { toast } from 'sonner';

export default async function InformesAdminSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<InformesAdmin searchParams={searchParams} />
		</Suspense>
	);
}

export interface Informe {
    id: string;
    titulo: string;
    subtitulo: string | null;
	conteudo: string;
    dataPublicacao: Date;
    publicado: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
	links: Partial<LinkInforme>[];
	arquivos: ArquivoInforme[];
}

interface IPaginadoInformes {
    pagina: number;
    limite: number;
    total: number;
    data: Informe[];
}

async function InformesAdmin({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const router = useRouter();
	router.push('/informes');
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '' } = await searchParams;
	let dados: Informe[] = [];
	
	// Buscar permissão do usuário logado
	const session = await auth();
	const usuarioLogado = session?.user as Usuario;
	if (!usuarioLogado) redirect('/auth/login');
	const permissao = await retornaPermissao(usuarioLogado.id);
	if (!permissao) redirect('/');
	
	try {
        const data = await buscarInformes(
            +pagina,
            +limite,
            busca as string,
        );
        if (data) {
            const paginado = data as IPaginadoInformes;
            pagina = paginado.pagina || 1;
            limite = paginado.limite || 10;
            total = paginado.total || 0;
            dados = paginado.data || [];
        }
	} catch (error) {
		console.error(error);
		toast.error('Erro ao buscar informações');
	}

	return (
		<div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-2">
		  <Card>
				<CardHeader>
				<CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Informes
				</CardTitle>
				<CardDescription>
					Visualize, edite e gerencie todos os informes do sistema
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
								placeholder: 'Digite o título, subtítulo ou conteúdo',
							}
						]}
						className='max-md:w-full'
					/>
					<Link href="/informes-admin/novo">
						<Button className='hover:opacity-80'>
							<PlusIcon className='w-4 h-4' />
							Novo Informe
						</Button>
					</Link>
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
