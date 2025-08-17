/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { Suspense } from 'react';
import { administradoraColumns } from './_components/administradora';
import { julgadoraColumns } from './_components/julgadora';
import { Arquivo, Avaliacao_Julgadora, Avaliacao_Licitadora, Participante, Permissao, Tipo_Carteira } from '@prisma/client';
import { buscarCadastros } from '@/services/cadastros';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { retornaPermissao, verificarPermissoes } from '@/services/usuarios';

export default async function CadastrosSuspense({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Cadastros searchParams={searchParams} />
		</Suspense>
	);
}

export interface ICadastro {
    id?: number;
    nome?: string;
    email?: string;
    cnpj?: string;
    cpf?: string;
    telefone?: string;
    cep?: string;
    uf?: string;
    cidade?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    protocolo?: string;
    carteira_tipo?: Tipo_Carteira;
    carteira_numero?: string;
    equipe?: boolean;
    criadoEm?: Date;
    atualizadoEm?: Date;
    arquivos?: Partial<Arquivo>[];
    participantes?: Partial<Participante>[];
    usuarioId?: string;
    avaliacao_licitadora?: Partial<Avaliacao_Licitadora>;
    avaliacoes_julgadora?: Partial<Avaliacao_Julgadora>[];
}

interface IPaginadoCadastro {
    pagina: number;
    limite: number;
    total: number;
    data: Partial<ICadastro>[];
}

async function Cadastros({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    if (!session) return redirect('/');
    if (!await verificarPermissoes(session.user.id, ["DEV", "ADMIN", "JULGADORA"]))
        return redirect('/meu-cadastro');
    const permissao: Permissao | null = await retornaPermissao(session.user.id);
    if (!permissao) return redirect('/');
	let { pagina = 1, limite = 10, total = 0 } = await searchParams;
	const { busca = '' } = await searchParams;
	let dados: ICadastro[] = [];
	try {
        const data = await buscarCadastros(
            permissao,
            +pagina,
            +limite,
            busca as string,
        );
        if (data) {
            const paginado = data as IPaginadoCadastro;
            pagina = paginado.pagina || 1;
            limite = paginado.limite || 10;
            total = paginado.total || 0;
            dados = paginado.data || [];
        }
	} catch (error) {
		console.error(error);
	}

	return (
		<div className='px-0 md:px-8 relative pb-20 md:pb-14 h-full container mx-auto py-8'>
			<h1 className='text-xl md:text-4xl font-bold'>Cadastros</h1>
			<div className='grid grid-cols-1 gap-y-3 my-5 '>
				{["ADMIN", "DEV"].includes(permissao) && <Filtros
					camposFiltraveis={[
						{
							nome: 'Busca',
							tag: 'busca',
							tipo: 0,
							placeholder: 'Digite o nome, email ou cnpj',
						}
					]}
				/>}
				<div className='w-full rounded-lg overflow-hidden'>
					<DataTable
						columns={
                            ["ADMIN", "DEV"].includes(permissao) ? administradoraColumns :
                            ["JULGADORA"].includes(permissao) ? julgadoraColumns :
                            []
                        }
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
			</div>
		</div>
	);
}
