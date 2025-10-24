"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ICadastro } from "../../cadastros/page"
import { useState, useTransition, useRef } from "react"
import { FolderOpen, Download, Trash2, Upload, AlertCircle, Loader2 } from "lucide-react"
import DragDropInput, { DragDropInputRef } from "@/components/drag-drop-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TipoArquivo } from "@prisma/client"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

interface ProjetosFormProps {
    cadastro: ICadastro
    atualizarPagina: (tab: string) => Promise<void>
}

const MAX_TOTAL_SIZE = 180 * 1024 * 1024; // 180MB em bytes

const uploadSchema = z.object({
    projetos: z.array(z.instanceof(File)).min(1, "Selecione pelo menos um projeto")
})

type UploadForm = z.infer<typeof uploadSchema>

export default function ProjetosForm({ cadastro, atualizarPagina }: ProjetosFormProps) {
    const [isPending, startTransition] = useTransition()
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
    const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
    const dragDropRef = useRef<DragDropInputRef>(null)
    
    // Filtrar apenas projetos
    const projetos = cadastro.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.PROJETOS) || []
    
    // Calcular tamanho total dos projetos existentes
    const tamanhoTotalExistente = projetos.reduce((total, projeto) => {
        return total + (projeto.tamanho || 0)
    }, 0)
    
    const espacoDisponivel = MAX_TOTAL_SIZE - tamanhoTotalExistente
    
    const form = useForm<UploadForm>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            projetos: []
        }
    })
    
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B'
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
        else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
    }
    
    const onSubmit = (data: UploadForm) => {
        startTransition(async () => {
            try {
                const formData = new FormData()
                
                // Adicionar cada arquivo ao FormData
                data.projetos.forEach((file) => {
                    formData.append(`documentos`, file)
                })
                
                formData.append('tipo', TipoArquivo.PROJETOS)
                formData.append('cadastroId', cadastro.id?.toString() || '')
                
                const response = await fetch(`/api/cadastro/${cadastro.id}/projetos`, {
                    method: 'POST',
                    body: formData
                })
                
                if (response.ok) {
                    toast.success('Projetos enviados com sucesso!')
                    form.reset()
                    dragDropRef.current?.reset()
                    await atualizarPagina('projetos')
                } else {
                    const { error } = await response.json() || { error: 'Erro ao enviar projetos. Tente novamente.' }
                    toast.error(error)
                }
            } catch (error) {
                console.error('Erro ao enviar projetos:', error)
                toast.error('Erro ao enviar projetos. Tente novamente.')
            }
        })
    }
    
    const deletarProjeto = async (arquivoId: string) => {
        setDeletingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/projetos/${arquivoId}`, {
                method: 'DELETE'
            })
            
            if (response.ok) {
                toast.success('Projeto removido com sucesso!')
                await atualizarPagina('projetos')
            } else {
                toast.error('Erro ao remover projeto. Tente novamente.')
            }
        } catch (error) {
            console.error('Erro ao deletar projeto:', error)
            toast.error('Erro ao remover projeto. Tente novamente.')
        } finally {
            setDeletingFileId(null)
        }
    }
    
    const downloadProjeto = async (arquivoId: string, nomeArquivo: string) => {
        setDownloadingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/projetos/${arquivoId}`)
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
                throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
            }
            
            // Verificar se a resposta é realmente um arquivo
            const contentType = response.headers.get('content-type')
            if (contentType?.includes('application/json')) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Resposta inesperada do servidor')
            }
            
            // Criar um blob com o conteúdo do arquivo
            const blob = await response.blob()
            
            if (blob.size === 0) {
                throw new Error('Arquivo vazio ou corrompido')
            }
            
            // Criar URL temporária para o blob
            const url = window.URL.createObjectURL(blob)
            
            // Criar elemento <a> temporário para download
            const a = document.createElement('a')
            a.href = url
            a.download = nomeArquivo
            document.body.appendChild(a)
            a.click()
            
            // Limpar recursos
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            
            toast.success('Download iniciado com sucesso!')
            
        } catch (error) {
            console.error('Erro ao fazer download:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
            toast.error(`Erro ao fazer download: ${errorMessage}`)
        } finally {
            setDownloadingFileId(null)
        }
    }
    
    const handleFileChange = (files: File[]) => {
        // Validar se os novos arquivos não excedem o limite
        const tamanhoNovosArquivos = files.reduce((total, file) => total + file.size, 0)
        
        if (tamanhoTotalExistente + tamanhoNovosArquivos > MAX_TOTAL_SIZE) {
            toast.error(`O tamanho total dos arquivos não pode exceder ${formatFileSize(MAX_TOTAL_SIZE)}`)
            return
        }
        
        form.setValue('projetos', files)
    }

    return (
        <div className="space-y-6">
            {/* Lista de Projetos Existentes */}
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        Propostas Técnicas Enviadas
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Lista de propostas técnicas já enviadas.
                    </CardDescription>
                    {projetos.length === 5 && (
                        <CardDescription className="text-sm text-green-600 sm:text-base">
                            Você enviou as 5 pranchas necessárias.
                        </CardDescription>
                    )}
                    {projetos.length < 5 && (
                        <CardDescription className="text-sm text-red-500 sm:text-base">
                            Você deve enviar 5 pranchas. {projetos.length} de 5 já foram enviadas.
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    {projetos.length > 0 ? (
                        <div className="space-y-3">
                            {projetos.map((projeto) => (
                                <div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <FolderOpen className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">{projeto.caminho?.split('/').pop()?.split('-').slice(1).join('-') || 'Projeto'}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatFileSize(projeto.tamanho || 0)} • Enviado em{' '}
                                                {projeto.criadoEm ? new Date(projeto.criadoEm).toLocaleDateString('pt-BR') : '---'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={downloadingFileId === projeto.id}
                                            onClick={() => {
                                                const nomeArquivo = projeto.caminho?.split('/').pop() || 'projeto'
                                                downloadProjeto(projeto.id!, nomeArquivo)
                                            }}
                                        >
                                            {downloadingFileId === projeto.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={deletingFileId === projeto.id}
                                            onClick={() => deletarProjeto(projeto.id!)}
                                        >
                                            {deletingFileId === projeto.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-blue-700">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>
                                        Espaço utilizado: {formatFileSize(tamanhoTotalExistente)} de {formatFileSize(MAX_TOTAL_SIZE)}
                                        {espacoDisponivel > 0 && ` • ${formatFileSize(espacoDisponivel)} disponível`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhuma proposta técnica enviada</p>
                            <p className="text-sm">Utilize o formulário abaixo para enviar sua proposta técnica</p>
                        </div>
                    )}
                </CardContent>

                {/* Formulário de Upload */}
                {espacoDisponivel > 0 && projetos.length < 5 && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardHeader className="px-4 sm:px-6 gap-4">
                                <Separator />
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <Upload className="h-5 w-5" />
                                    Enviar proposta técnica
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    <p>Fase 1: Envie sua proposta técnica em nível de Estudo Preliminar</p>
                                    <p className="text-xs">Limite máximo total: {formatFileSize(MAX_TOTAL_SIZE)}</p>
                                    <div className="flex items-start p-4 border rounded-lg bg-gray-50 mt-4">
                                        <div className="w-full overflow-x-auto">
                                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 text-center uppercase">FASE 1</h4>
                                            <table className="w-full mt-2 text-[11px] sm:text-xs text-gray-800 border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th colSpan={8} className="border px-2 py-2 bg-gray-900 text-white text-center uppercase tracking-wide">Nomenclatura de documentos</th>
                                                    </tr>
                                                    <tr className="bg-gray-100">
                                                        <th className="border px-2 py-1">Parte inicial</th>
                                                        <th className="border px-2 py-1">Parte 1</th>
                                                        <th className="border px-2 py-1">Parte 2</th>
                                                        <th className="border px-2 py-1">Parte 3</th>
                                                        <th className="border px-2 py-1">Parte 4</th>
                                                        <th className="border px-2 py-1">Parte 5</th>
                                                        <th className="border px-2 py-1">Parte 6</th>
                                                        <th className="border px-2 py-1">Parte final</th>
                                                    </tr>
                                                    <tr>
                                                        <th className="border px-2 py-1">Identificação do participante</th>
                                                        <th className="border px-2 py-1">Sigla</th>
                                                        <th className="border px-2 py-1">Edição</th>
                                                        <th className="border px-2 py-1">Etapa de projeto</th>
                                                        <th className="border px-2 py-1">Disciplina</th>
                                                        <th className="border px-2 py-1">Tipo de documento</th>
                                                        <th className="border px-2 py-1">Número do documento</th>
                                                        <th className="border px-2 py-1">Revisão</th>
                                                    </tr>
                                                    <tr className="bg-white">
                                                        <td className="border px-2 py-1 text-center">19 caracteres</td>
                                                        <td className="border px-2 py-1 text-center">3 caracteres</td>
                                                        <td className="border px-2 py-1 text-center">2 caracteres</td>
                                                        <td className="border px-2 py-1 text-center">1 caracter</td>
                                                        <td className="border px-2 py-1 text-center">2 caracteres</td>
                                                        <td className="border px-2 py-1 text-center">2 caracteres</td>
                                                        <td className="border px-2 py-1 text-center">3 caracteres</td>
                                                        <td className="border px-2 py-1 text-center">1 caracter</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1 text-center">letras maiúsculas, números e traços</td>
                                                        <td className="border px-2 py-1 text-center">letras maiúsculas</td>
                                                        <td className="border px-2 py-1 text-center">números</td>
                                                        <td className="border px-2 py-1 text-center">números</td>
                                                        <td className="border px-2 py-1 text-center">letras maiúsculas</td>
                                                        <td className="border px-2 py-1 text-center">letras maiúsculas</td>
                                                        <td className="border px-2 py-1 text-center">números</td>
                                                        <td className="border px-2 py-1 text-center">número</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border text-center uppercase tracking-wide">
                                                        <td>{(cadastro.protocolo ?? 'MOB-2025-0000000000')}</td>
                                                        <td>CMU</td>
                                                        <td>01</td>
                                                        <td>1</td>
                                                        <td>MU</td>
                                                        <td>DE</td>
                                                        <td>001</td>
                                                        <td>0</td>
                                                    </tr>
                                                    <tr className="border px-2 py-2 text-center text-2xl uppercase tracking-wide">
                                                        <td colSpan={8}>
                                                            {(cadastro.protocolo ?? 'MOB-2025-0000000000')}_CMU_01_1_MU_DE_001_0.pdf
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] sm:text-xs">
                                                <div className="bg-white border rounded p-2">
                                                    <p className="font-semibold">Exemplo de submissão de documentos do participante:</p>
                                                    <ul className="list-disc ml-4 mt-1 font-mono">
                                                        <li>{(cadastro.protocolo ?? 'MOB-2025-0000000000')}_CMU_01_1_MU_DE_001_0.pdf</li>
                                                        <li>{(cadastro.protocolo ?? 'MOB-2025-0000000000')}_CMU_01_1_MU_DE_002_0.pdf</li>
                                                        <li>{(cadastro.protocolo ?? 'MOB-2025-0000000000')}_CMU_01_1_MU_DE_003_0.pdf</li>
                                                        <li>{(cadastro.protocolo ?? 'MOB-2025-0000000000')}_CMU_01_1_MU_DE_004_0.pdf</li>
                                                        <li>{(cadastro.protocolo ?? 'MOB-2025-0000000000')}_CMU_01_1_MU_DE_005_0.pdf</li>
                                                    </ul>
                                                </div>
                                                <div className="bg-white border rounded p-2">
                                                    <p className="text-[11px] sm:text-xs">
                                                        Atenção: Ao organizar os desenhos nas pranchas, é obrigatório seguir a
                                                        sequência de Grupos e Elementos de Mobiliário Urbano apresentada no Edital do Concurso.
                                                    </p>
                                                </div>
                                                <div className="bg-white border rounded p-2">
                                                    <p className="font-semibold">Parte 6 | Número do documento</p>
                                                    <ul className="grid grid-cols-5 gap-1 mt-1 font-mono text-center">
                                                        <li>001</li>
                                                        <li>002</li>
                                                        <li>003</li>
                                                        <li>004</li>
                                                        <li>005</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="mt-2 text-right">
                                                <a
                                                    href="/modelos/CMU_Nomenclatura-dos-arquivos.zip"
                                                    className="text-xs underline text-blue-600 hover:text-blue-700"
                                                    download
                                                >
                                                    Baixar guia de nomenclatura
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6 space-y-4">
                                {espacoDisponivel < MAX_TOTAL_SIZE * 0.1 && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Atenção: Pouco espaço disponível ({formatFileSize(espacoDisponivel)}). 
                                            Considere remover alguns projetos antes de enviar novos.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                <FormField
                                    control={form.control}
                                    name="projetos"
                                    render={({ field }) => (
                                        <FormItem className="w-full mt-4">
                                            <FormLabel>Arquivos de Projeto</FormLabel>
                                            <FormControl>
                                                <DragDropInput
                                                    ref={dragDropRef}
                                                    accept=".pdf"
                                                    multiple={true}
                                                    maxSize={espacoDisponivel}
                                                    maxFiles={5 - projetos.length}
                                                    buttonText="Selecionar projetos"
                                                    dropzoneText="Arraste e solte seus projetos aqui"
                                                    helperText="Formatos aceitos: PDF"
                                                    onChange={handleFileChange}
                                                    disabled={isPending}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="px-4 sm:px-6 mt-4 flex justify-end">
                                <Button 
                                    type="submit" 
                                    disabled={isPending || !form.watch('projetos')?.length}
                                    className="w-full sm:w-auto"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Enviar Projetos
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                )}
            </Card>
            
            {espacoDisponivel <= 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Limite de {formatFileSize(MAX_TOTAL_SIZE)} atingido. 
                        Remova alguns projetos para enviar novos arquivos.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}