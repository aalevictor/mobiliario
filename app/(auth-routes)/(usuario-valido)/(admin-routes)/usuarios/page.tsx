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
		<div className='px-3 md:px-8 relative pb-20 md:pb-14 h-full container mx-auto py-4'>
			<h1 className='text-xl md:text-4xl font-bold'>Usuários</h1>
			<div className='grid grid-cols-1 gap-y-3 my-5 '>
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'Digite o nome, email ou login',
						}
					]}
				/>
				<div className='w-full rounded-lg overflow-hidden'>
					<DataTable
						columns={columns}
						data={dados || []}
					/>
				</div>
				{dados && dados.length > 0 && (
					<Pagination
						total={+total}
						pagina={+pagina}
						limite={+limite}
					/>
				)}
				<div className='absolute bottom-4 right-4'>
					<ModalUsuario />
				</div>
			</div>
		</div>
	);
}
