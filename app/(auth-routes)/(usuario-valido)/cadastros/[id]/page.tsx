import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FolderOpen, MapPin, User, Users } from "lucide-react";
import { buscarCadastro, buscarCadastroJulgadora } from "@/services/cadastros";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Arquivo, Participante } from "@prisma/client";
import { auth } from "@/auth";
import { retornaPermissao, verificarPermissoes } from "@/services/usuarios";
import DownloadButton from "./_components/download-button";
import ViewModalButton from "./_components/view-modal-button";
import ViewButton from "./_components/view-button";
import CadastroClientWrapper from "./_components/cadastro-client-wrapper";
import AvaliacaoJulgadora from "./_components/avaliacao-julgadora"
import IniciarAvaliacaoButton from "./_components/iniciar-avaliacao-button";

async function CadastroAdmin({ id, usuarioId }: { id: string, usuarioId: string }) {
    const cadastro = await buscarCadastro(+id);
    if (!cadastro) redirect('/cadastros');
    const podeDownload = await verificarPermissoes(usuarioId, ["ADMIN", "DEV"]);
    return (<div className="px-0 md:px-8 relative h-full container mx-auto py-8">
        <div className="space-y-2 max-w-6xl mx-auto">
            {/* Seção Projetos */}
            <Card>
                <CardHeader className="max-sm:border-none">
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <Link href="/cadastros">
                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <span className="text-xl sm:text-2xl">{cadastro.protocolo}</span>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Visualize todas as informações do cadastro enviado pelo participante.
                    </CardDescription>
                </CardHeader>
            </Card>
            {/* <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FolderOpen className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Documentos</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {cadastro.arquivos && cadastro.arquivos.length > 0 ? (
                        <div className="space-y-3">
                            {cadastro.arquivos.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FolderOpen className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.caminho?.split('/')?.pop() || 'Documento'}>{arquivo.caminho?.split('/')?.pop() || 'Documento'}</p>
                                            <p className="text-sm text-gray-600">
                                                Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}
                                            </p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <ViewButton
                                                cadastroId={+id}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/')?.pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <ViewModalButton
                                                cadastroId={+id}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/')?.pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <DownloadButton
                                                cadastroId={+id}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/')?.pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum documento encontrado</p>
                            <p className="text-sm">Documentos não foram enviados</p>
                        </div>
                    )}
                </CardContent>
            </Card> */}
            {/* Seção de dados do Cadastro */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Dados do cadastro</CardTitle>
                    </div>
                    <CardDescription className="text-sm sm:text-base">
                        Informações principais do responsável e da inscrição.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-medium text-gray-600">Nome</span>
                            <p className="text-base font-medium">{cadastro.nome || 'Não informado'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">E-mail</span>
                            <p className="text-base font-medium">{cadastro.email || 'Não informado'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Telefone</span>
                            <p className="text-base font-medium">{cadastro.telefone || 'Não informado'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Tipo de inscrição</span>
                            <p className="text-base font-medium">{cadastro.cnpj ? 'Pessoa Jurídica' : 'Pessoa Física'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">CPF</span>
                            <p className="text-base font-medium">{cadastro.cpf || 'Não informado'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">CNPJ</span>
                            <p className="text-base font-medium">{cadastro.cnpj || 'Não informado'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Data de envio</span>
                            <p className="text-base font-medium">{cadastro.criadoEm ? new Date(cadastro.criadoEm).toLocaleDateString('pt-BR') : '---'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Protocolo</span>
                            <p className="text-base font-medium">{cadastro.protocolo || '---'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Seção Participantes */}
            {cadastro.participantes && cadastro.participantes.length > 0 && <Card>
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Participantes
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Lista dos participantes vinculados ao cadastro.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(cadastro.participantes || []).map((participante: Partial<Participante>) => (
                            <div key={participante.id} className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <p className="font-medium">{participante.nome}</p>
                                </div>
                                <p className="text-sm text-gray-600">Documento: {participante.documento}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>}
            {/* Seção Endereço */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Endereço</CardTitle>
                    </div>
                    <CardDescription className="text-sm sm:text-base">
                        Informações de localização do cadastro.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p><span className="font-medium">Endereço:</span> {(cadastro.logradouro || cadastro.numero || cadastro.complemento) ? [cadastro.logradouro, cadastro.numero].filter(Boolean).join(', ') + (cadastro.complemento ? ` - ${cadastro.complemento}` : '') : 'Não informado'}</p>
                        <p><span className="font-medium">CEP:</span> {cadastro.cep || 'Não informado'}</p>
                        <p><span className="font-medium">UF:</span> {cadastro.uf || 'Não informado'}</p>
                        <p><span className="font-medium">Cidade:</span> {cadastro.cidade || 'Não informado'}</p>
                    </div>
                </CardContent>
            </Card>
            <CadastroClientWrapper initialCadastro={cadastro} podeDownload={podeDownload} />
        </div>
    </div>)
}

async function CadastroJulgadora({ id, usuarioId }: { id: string, usuarioId: string }) {
    const cadastro = await buscarCadastroJulgadora(+id, usuarioId);
    if (!cadastro) redirect('/cadastros');
    const podeDownload = await verificarPermissoes(usuarioId, ["JULGADORA"]);
    let projetos: Partial<Arquivo> & { nome: string } [] = [];
    cadastro.arquivos.map((arquivo: Partial<Arquivo>) => {
        if (arquivo.tipo === 'PROJETOS') {
            projetos.push({
                ...arquivo,
                nome: arquivo.caminho?.split('/')?.pop()?.split('-').slice(1).join('-') || 'Projeto',
            });
        }
    })
    projetos = projetos.sort((a, b) => a.nome.localeCompare(b.nome));
    return (<div className="px-0 md:px-8 relative h-full container mx-auto py-8">
        <div className="space-y-2 max-w-6xl mx-auto">
            {/* Seção Projetos */}
            <Card>
                <CardHeader className="max-sm:border-none">
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <Link href="/cadastros">
                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <span className="text-xl sm:text-2xl">{cadastro.protocolo}</span>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Visualize todas as informações do cadastro enviado pelo participante.
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FolderOpen className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Projetos</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {projetos && projetos.length > 0 ? (
                        <div className="space-y-3">
                            {projetos.map((arquivo: Partial<Arquivo> & { nome: string }) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FolderOpen className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.nome}>{arquivo.nome}</p>
                                            <p className="text-sm text-gray-600">
                                                Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}
                                            </p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <ViewButton
                                                cadastroId={+id}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.nome}
                                                className="cursor-pointer"
                                                tipo="projetos"
                                            />
                                            <ViewModalButton
                                                cadastroId={+id}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.nome}
                                                className="cursor-pointer"
                                                tipo="projetos"
                                            />
                                            <DownloadButton
                                                cadastroId={+id}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.nome}
                                                className="cursor-pointer"
                                                tipo="projetos"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum projeto encontrado</p>
                            <p className="text-sm">Projetos não foram enviados</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Sua avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                    {cadastro.avaliacoes_julgadora?.[0]?.id ? (
                        <AvaliacaoJulgadora 
                            avaliacao={cadastro.avaliacoes_julgadora[0]} 
                            cadastroId={+id}
                        />
                    ) : (
                        <IniciarAvaliacaoButton cadastroId={+id} />
                    )}
                </CardContent>
            </Card>
        </div>
    </div>)
}

export default async function Cadastro({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session) redirect('/auth/login');
    const permissao = await retornaPermissao(session.user.id);
    if (permissao === "PARTICIPANTE") redirect('/meu-cadastro');
    if (permissao === "JULGADORA") {
        return <CadastroJulgadora id={id} usuarioId={session.user.id} />
    }
    return <CadastroAdmin id={id} usuarioId={session.user.id} />    
}
