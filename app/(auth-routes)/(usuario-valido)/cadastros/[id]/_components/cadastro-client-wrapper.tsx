"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Loader2, Trash2 } from "lucide-react"
import { Arquivo, TipoArquivo } from "@prisma/client"
import { ICadastroBusca } from "@/services/cadastros"
import DownloadButton from "./download-button"
import ViewModalButton from "./view-modal-button"
import ViewButton from "./view-button"
import FormArquivos from "./form-arquivos"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CadastroClientWrapperProps {
    initialCadastro: ICadastroBusca
    podeDownload: boolean
}

export default function CadastroClientWrapper({ initialCadastro, podeDownload }: CadastroClientWrapperProps) {
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
    const documentos = cadastro.arquivos?.filter((arquivo: { tipo: string; caminho: string }) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && !arquivo.caminho.split("/").pop()?.startsWith("RECURSO-")) || []
    const recursos = cadastro.arquivos?.filter((arquivo: { tipo: string; caminho: string }) => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho.split("/").pop()?.startsWith("RECURSO-")) || []
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
                                        <div>
                                            <p className="font-medium break-words md:truncate md:max-w-[360px]">{arquivo.caminho?.split('/').pop() || 'Documento Específico'}</p>
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
                <FormArquivos
                    tipo="documento"
                    cadastro={cadastro}
                    onSuccess={handleRefreshCadastro}
                />
            </Card>

            {/* Seção Recurso */}
            {!eDeferido && (
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
                                            <div>
                                                <p className="font-medium break-words md:truncate md:max-w-[360px]">{arquivo.caminho?.split('/').pop() || 'Documento de Recurso'}</p>
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
                    <FormArquivos
                        tipo="recurso"
                        cadastro={cadastro}
                        onSuccess={handleRefreshCadastro}
                    />
                </Card>
            )}

            {/* Seção Projetos */}
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
                            {projetos.map((arquivo: Partial<Arquivo>) => (
                                <div key={arquivo.id} className="p-3 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-start md:items-center gap-3">
                                        <FolderOpen className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium break-words md:truncate md:max-w-[360px]">{arquivo.caminho?.split('/').pop() || 'Projeto'}</p>
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
        </>
    )
}