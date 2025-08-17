import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, FileText, FolderOpen, User, Users } from "lucide-react";
import { buscarCadastro } from "@/services/cadastros";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModalLicitadora from "../_components/modal-licitadora";
import { ICadastro } from "../page";
import { TipoArquivo } from "@prisma/client";

export default async function Cadastro({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cadastro = await buscarCadastro(+id);
    if (!cadastro) redirect('/cadastros');
    const projetos = cadastro.arquivos.filter((arquivo) => arquivo.tipo === TipoArquivo.PROJETOS);
    const documentos = cadastro.arquivos.filter((arquivo) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA);

    return (<div className="px-0 md:px-8 relative h-full container mx-auto py-8">
        <Card className="container mx-auto px-0 max-sm:px-2 py-6 max-w-6xl max-sm:bg-transparent max-sm:shadow-none max-sm:border-none max-sm:p-0">
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
            <CardContent>
                <div className="space-y-6">
                    {/* Seção Responsável */}
                    <Card className="shadow-none border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg text-primary">Responsável pelo Projeto</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Nome Completo</span>
                                    <p className="text-base font-medium">{cadastro.nome || "Não informado"}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">E-mail</span>
                                    <p className="text-base font-medium">{cadastro.email || "Não informado"}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Telefone</span>
                                    <p className="text-base font-medium">{cadastro.telefone || "Não informado"}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Carteira Profissional</span>
                                    <p className="text-base font-medium">
                                        {cadastro.carteira_tipo && cadastro.carteira_numero 
                                            ? `${cadastro.carteira_tipo} - ${cadastro.carteira_numero}`
                                            : "Não informado"
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seção Empresa */}
                    <Card className="shadow-none border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg text-primary">Dados da Empresa</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-600">CNPJ</span>
                                    <p className="text-base font-medium">{cadastro.cnpj || "Não informado"}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">CEP</span>
                                    <p className="text-base font-medium">{cadastro.cep || "Não informado"}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-sm font-medium text-gray-600">Endereço Completo</span>
                                    <p className="text-base font-medium">
                                        {[
                                            cadastro.logradouro,
                                            cadastro.numero && `nº ${cadastro.numero}`,
                                            cadastro.complemento && `- ${cadastro.complemento}`,
                                            `${cadastro.cidade} - ${cadastro.uf}`
                                        ].filter(Boolean).join(', ') || "Não informado"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seção Participantes */}
                    <Card className="shadow-none border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg text-primary">Participantes da Equipe</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {cadastro.participantes && cadastro.participantes.length > 0 ? (
                                <div className="space-y-3">
                                    {cadastro.participantes.map((participante) => (
                                        <div key={participante.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <User className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium">{participante.nome}</p>
                                                <p className="text-sm text-gray-600">CPF: {participante.documento}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>Nenhum participante cadastrado</p>
                                    <p className="text-sm">Esta é uma inscrição individual</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Seção Documentação */}
                    <Card className="shadow-none border-gray-200">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg text-primary">Documentação Específica</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {documentos && documentos.length > 0 ? (
                                <div className="space-y-3">
                                    {documentos.map((arquivo) => (
                                        <div key={arquivo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FileText className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium">Documento</p>
                                                <p className="text-sm text-gray-600">{arquivo.caminho}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>Nenhum documento encontrado</p>
                                    <p className="text-sm">Documentação específica não foi enviada</p>
                                </div>
                            )}
                        </CardContent>
                        {documentos && documentos.length > 0 && (
                            <CardFooter className="flex justify-end">
                                <ModalLicitadora cadastro={cadastro as ICadastro} />
                            </CardFooter>
                        )}
                    </Card>

                    {/* Seção Projetos */}
                    <Card className="shadow-none border-gray-200">
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
                                    {projetos.map((arquivo) => (
                                        <div key={arquivo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <FolderOpen className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium">Projeto</p>
                                                <p className="text-sm text-gray-600">{arquivo.caminho}</p>
                                            </div>
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
                </div>
            </CardContent>
        </Card>
    </div>)
}
