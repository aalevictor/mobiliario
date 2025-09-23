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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-select';
import ExportarCadastros from './_components/exportar-cadastros';
import ExportarParticipantes from './_components/exportar-participantes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
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
	const { busca = '', documentosEnviados = '', projetosEnviados = '', tipoInscricao = '' } = await searchParams;
	let dados: ICadastro[] = [];
	try {
        const data = await buscarCadastros(
            permissao,
            +pagina,
            +limite,
            busca as string,
            documentosEnviados as string,
            projetosEnviados as string,
            tipoInscricao as string,
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

    const selectArquivos = [
        { label: 'Enviou arquivos', value: 'true' },
        { label: 'Nenhum arquivo enviado', value: 'false' },
    ]

    const selectTipoInscricao = [
        { label: 'Pessoa Física', value: 'PF' },
        { label: 'Pessoa Jurídica', value: 'PJ' },
    ]

    return (
        <div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-2">
		    <Card>
				<CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Cadastros
                    </CardTitle>
                    <CardDescription>
                        Visualize, edite e gerencie todos os cadastros
                    </CardDescription>
				</CardHeader>
			</Card>
			{["ADMIN", "DEV"].includes(permissao) && <Card>
				<CardContent className='flex justify-between items-end max-md:flex-col max-md:gap-4'>
                    <Filtros
                        camposFiltraveis={[
                            {
                                nome: 'Busca',
                                tag: 'busca',
                                tipo: 0,
                                placeholder: 'Digite o nome, email ou cnpj',
                            },{
                                nome: 'Documentos Enviados',
                                tag: 'documentosEnviados',
                                tipo: 2,
                                placeholder: 'Documentos Enviados',
                                valores: selectArquivos,
                            },{
                                nome: 'Projetos Enviados',
                                tag: 'projetosEnviados',
                                tipo: 2,
                                placeholder: 'Projetos Enviados',
                                valores: selectArquivos,
                            },{
                                nome: 'Tipo de Inscrição',
                                tag: 'tipoInscricao',
                                tipo: 2,
                                placeholder: 'Tipo de Inscrição',
                                valores: selectTipoInscricao,
                            },
                        ]}
                        className='max-md:w-full'
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button>
                                <MoreHorizontal className='w-4 h-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <ExportarParticipantes filtros={{
                                busca: busca as string,
                                documentosEnviados: documentosEnviados as string,
                                projetosEnviados: projetosEnviados as string,
                                tipoInscricao: tipoInscricao as string,
                            }} />
                            <ExportarCadastros filtros={{
                                busca: busca as string,
                                documentosEnviados: documentosEnviados as string,
                                projetosEnviados: projetosEnviados as string,
                                tipoInscricao: tipoInscricao as string,
                            }} />
                        </DropdownMenuContent>
                    </DropdownMenu>
				</CardContent>
		  	</Card>}
			<Card className='pt-0'>
				<CardContent className='p-0'>
					<div className='w-full rounded-lg overflow-hidden mb-4'>
                        <DataTable
                            columns={
                                ["ADMIN", "DEV"].includes(permissao) ? administradoraColumns :
                                ["JULGADORA"].includes(permissao) ? julgadoraColumns :
                                []
                            }
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
    )
}
