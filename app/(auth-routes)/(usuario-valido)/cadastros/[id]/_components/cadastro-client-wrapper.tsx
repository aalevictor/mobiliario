"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen } from "lucide-react"
import { Arquivo, TipoArquivo } from "@prisma/client"
import { ICadastroBusca } from "@/services/cadastros"
import DownloadButton from "./download-button"
import ViewModalButton from "./view-modal-button"
import ViewButton from "./view-button"
import { toast } from "sonner"
import DevUploadForm from "./dev-upload-form"
import PropostaSelect from "./proposta-select"
import LiberarFase2Button from "./liberar-fase2-button"

interface CadastroClientWrapperProps {
    initialCadastro: ICadastroBusca
    podeDownload: boolean
    isDev?: boolean
}

export default function CadastroClientWrapper({ initialCadastro, podeDownload, isDev }: CadastroClientWrapperProps) {
    const [cadastro, setCadastro] = useState(initialCadastro)
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
    
    const handleRefreshCadastro = useCallback(async () => {
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}`)
            if (response.ok) {
                const updatedCadastro = await response.json()
                setCadastro(updatedCadastro)
            }
        } catch (error) {
            console.error('Erro ao atualizar cadastro:', error)
        }
    }, [cadastro.id])
    
    const deletarDocumento = async (arquivoId: string) => {
        setDeletingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos/${arquivoId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                toast.success('Documento removido com sucesso!')
                await handleRefreshCadastro()
            } else {
                toast.error('Erro ao remover documento. Tente novamente.')
            }
        } catch (error) {
            console.error('Erro ao deletar documento:', error)
            toast.error('Erro ao remover documento. Tente novamente.')
        } finally {
            setDeletingFileId(null)
        }
    }
    
    const projetos = cadastro.arquivos?.filter((arquivo: { tipo: string; }) => arquivo.tipo === TipoArquivo.PROJETOS) || []
    const projetos2 = cadastro.arquivos?.filter((arquivo: { tipo: string; }) => arquivo.tipo === TipoArquivo.PROJETOS_2) || []
    const projetos2Identificados = projetos2.filter((a: { caminho: string }) => {
        const nome = a.caminho.split('/').pop() || '';
        return nome.startsWith('IDENTIFICADO-') || nome.startsWith('EMAIL-IDENTIFICADO-');
    })
    const projetos2NaoIdentificados = projetos2.filter((a: { caminho: string }) => {
        const nome = a.caminho.split('/').pop() || '';
        return !nome.startsWith('IDENTIFICADO-') && !nome.startsWith('EMAIL-IDENTIFICADO-');
    })
    const documentos = cadastro.arquivos?.filter((arquivo: { tipo: string; caminho: string }) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && !arquivo.caminho.split("/").pop()?.startsWith("RECURSO-") && !arquivo.caminho.split("/").pop()?.startsWith("HABILITACAO-")) || []
    const recursos = cadastro.arquivos?.filter((arquivo: { tipo: string; caminho: string }) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho.split("/").pop()?.startsWith("RECURSO-")) || []
    const habilitacao = cadastro.arquivos?.filter((arquivo: { tipo: string; caminho: string }) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho.split("/").pop()?.startsWith("HABILITACAO-")) || []
    const eDeferido = !!cadastro.avaliacao_licitadora && cadastro.avaliacao_licitadora.aprovado
    return (
        <>
            {/* Seção Documentos */}
            <Card>
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
                            {documentos.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.caminho?.split('/').pop() || 'Documento Específico'}>{arquivo.caminho?.split('/').pop() || 'Documento Específico'}</p>
                                            <p className="text-sm text-gray-600">Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}</p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <ViewButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <ViewModalButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <DownloadButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    )}
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
                {/* <FormArquivos
                    tipo="documento"
                    cadastro={cadastro}
                    onSuccess={handleRefreshCadastro}
                /> */}
            </Card>

            {/* Seção Habilitação */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Documentação de Habilitação</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {habilitacao && habilitacao.length > 0 ? (
                        <div className="space-y-3">
                            {habilitacao.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.caminho?.split('/').pop() || 'Documento de Recurso'}>{arquivo.caminho?.split('/').pop() || 'Documento de Recurso'}</p>
                                            <p className="text-sm text-gray-600">Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}</p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <ViewButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <ViewModalButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <DownloadButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum documento encontrado</p>
                            <p className="text-sm">Documentação de recurso não foi enviada</p>
                        </div>
                    )}
                </CardContent>
                {/* <FormArquivos
                    tipo="recurso"
                    cadastro={cadastro}
                    onSuccess={handleRefreshCadastro}
                /> */}
            </Card>

            {/* Seção Recurso */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Documentação de Recurso</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {recursos && recursos.length > 0 ? (
                        <div className="space-y-3">
                            {recursos.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.caminho?.split('/').pop() || 'Documento de Recurso'}>{arquivo.caminho?.split('/').pop() || 'Documento de Recurso'}</p>
                                            <p className="text-sm text-gray-600">Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}</p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <ViewButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <ViewModalButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                            <DownloadButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum documento encontrado</p>
                            <p className="text-sm">Documentação de recurso não foi enviada</p>
                        </div>
                    )}
                </CardContent>
                {/* <FormArquivos
                    tipo="recurso"
                    cadastro={cadastro}
                    onSuccess={handleRefreshCadastro}
                /> */}
            </Card>

            {/* Seção Projetos Fase 1 */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FolderOpen className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Projetos Fase 1</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {projetos && projetos.length > 0 ? (
                        <div className="space-y-3">
                            {projetos.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FolderOpen className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.caminho?.split('/').pop() || 'Projeto'}>{arquivo.caminho?.split('/').pop() || 'Projeto'}</p>
                                            <p className="text-sm text-gray-600">Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}</p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <ViewButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'documento'}
                                                className="cursor-pointer"
                                                tipo="projetos"
                                            />
                                            <ViewModalButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
                                                className="cursor-pointer"
                                                tipo="projetos"
                                            />
                                            <DownloadButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
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

            {/* Seção Projetos Fase 2 — Identificados */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FolderOpen className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Projetos Fase 2 — Identificados</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {projetos2Identificados.length > 0 ? (
                        <div className="space-y-3">
                            {projetos2Identificados.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FolderOpen className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.caminho?.split('/').pop() || 'Projeto'}>
                                                {arquivo.caminho?.split('/').pop()?.replace(/^(EMAIL-)?(IDENTIFICADO-|NAO_IDENTIFICADO-)(\d+-)/, '') || 'Projeto'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}
                                            </p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end items-center">
                                            <PropostaSelect
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                proposta={(arquivo as any).proposta ?? "FASE1"}
                                                onUpdate={handleRefreshCadastro}
                                            />
                                            <ViewButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
                                                className="cursor-pointer"
                                                tipo="projetos2"
                                            />
                                            <ViewModalButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
                                                className="cursor-pointer"
                                                tipo="projetos2"
                                            />
                                            <DownloadButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
                                                className="cursor-pointer"
                                                tipo="projetos2"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum projeto identificado encontrado</p>
                            <p className="text-sm">Projetos identificados da Fase 2 não foram enviados</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Seção Projetos Fase 2 — Não Identificados */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FolderOpen className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg text-primary">Projetos Fase 2 — Não Identificados</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {projetos2NaoIdentificados.length > 0 ? (
                        <div className="space-y-3">
                            {projetos2NaoIdentificados.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FolderOpen className="h-5 w-5 text-gray-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-all md:break-words md:max-w-[360px]" title={arquivo.caminho?.split('/').pop() || 'Projeto'}>
                                                {arquivo.caminho?.split('/').pop()?.replace(/^(EMAIL-)?(IDENTIFICADO-|NAO_IDENTIFICADO-)(\d+-)/, '') || 'Projeto'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Enviado em {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}
                                            </p>
                                        </div>
                                    </div>
                                    {podeDownload && arquivo.id && (
                                        <div className="flex flex-wrap gap-2 md:justify-end items-center">
                                            <LiberarFase2Button
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                liberado={(arquivo as any).liberadoFase2 ?? false}
                                                onUpdate={handleRefreshCadastro}
                                            />
                                            <PropostaSelect
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                proposta={(arquivo as any).proposta ?? "FASE1"}
                                                onUpdate={handleRefreshCadastro}
                                            />
                                            <ViewButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
                                                className="cursor-pointer"
                                                tipo="projetos2"
                                            />
                                            <ViewModalButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
                                                className="cursor-pointer"
                                                tipo="projetos2"
                                            />
                                            <DownloadButton
                                                cadastroId={cadastro.id!}
                                                arquivoId={arquivo.id}
                                                nomeArquivo={arquivo.caminho?.split('/').pop() || 'projeto'}
                                                className="cursor-pointer"
                                                tipo="projetos2"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum projeto não identificado encontrado</p>
                            <p className="text-sm">Projetos não identificados da Fase 2 não foram enviados</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload DEV — sem restrição de prazo */}
            {isDev && (
                <DevUploadForm
                    cadastroId={cadastro.id!}
                    onSuccess={handleRefreshCadastro}
                />
            )}
        </>
    )
}