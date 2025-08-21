/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import { Usuario } from '@prisma/client';
import ModalUsuario from './_components/modal_usuario';
import { buscarUsuarios, retornaPermissao } from '@/services/usuarios';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default async function UsuariosSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Usuarios searchParams={searchParams} />
		</Suspense>
	);
}

interface IPaginadoUsuario {
    pagina: number;
    limite: number;
    total: number;
    data: Usuario[];
}

async function Usuarios({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '' } = await searchParams;
	let dados: Usuario[] = [];
	
	// Buscar permissão do usuário logado
	const session = await auth();
	const usuarioLogado = session?.user as Usuario;
	if (!usuarioLogado) redirect('/auth/login');
	const permissao = await retornaPermissao(usuarioLogado.id);
	if (!permissao) redirect('/');
	
	try {
        const data = await buscarUsuarios(
            +pagina,
            +limite,
            busca as string,
        );
        if (data) {
            const paginado = data as IPaginadoUsuario;
            pagina = paginado.pagina || 1;
            limite = paginado.limite || 10;
            total = paginado.total || 0;
            dados = paginado.data || [];
        }
	} catch (error) {
		console.error(error);
	}

	return (
		<div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-2">
		  <Card>
				<CardHeader>
				<CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Usuários
				</CardTitle>
				<CardDescription>
					Visualize, edite e gerencie todos os usuários do sistema
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
								placeholder: 'Digite o nome, email ou login',
							}
						]}
						className='max-md:w-full'
					/>
					<ModalUsuario>
						<Button className='hover:opacity-80'>
							<PlusIcon className='w-4 h-4' />
							Novo Usuário
						</Button>
					</ModalUsuario>
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
