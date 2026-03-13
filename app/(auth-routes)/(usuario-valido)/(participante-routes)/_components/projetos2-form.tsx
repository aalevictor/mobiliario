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

interface Projetos2FormProps {
    cadastro: ICadastro
    atualizarPagina: (tab: string) => Promise<void>
}

const MAX_TOTAL = 600 * 1024 * 1024; // 600MB total entre identificados e não identificados
const DATA_LIMITE = new Date('2026-03-20T23:59:59.999');

const uploadSchema = z.object({
    arquivos: z.array(z.instanceof(File)).min(1, "Selecione pelo menos um arquivo")
})

type UploadForm = z.infer<typeof uploadSchema>

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

function isIdentificado(caminho: string): boolean {
    const nome = caminho.split('/').pop() || '';
    return nome.startsWith('IDENTIFICADO-') || nome.startsWith('EMAIL-IDENTIFICADO-');
}

interface UploadAreaProps {
    cadastro: ICadastro
    identificado: boolean
    arquivosExistentes: NonNullable<ICadastro['arquivos']>
    tamanhoTotalGeral: number
    onSuccess: () => Promise<void>
}

function UploadArea({ cadastro, identificado, arquivosExistentes, tamanhoTotalGeral, onSuccess }: UploadAreaProps) {
    const [isPending, startTransition] = useTransition()
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
    const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
    const dragDropRef = useRef<DragDropInputRef>(null)

    const titulo = identificado ? 'Projetos Identificados' : 'Projetos Não Identificados'
    const descricao = identificado
        ? 'Com carimbo completo nas pranchas, memoriais e planilhas, que deverão relacionar, obrigatoriamente, o RESPONSÁVEL TÉCNICO PELO PROJETO, com indicação do número do registro profissional (CAU ou CREA).'
        : 'Com carimbo que indique somente o ID da proposta e a identificação do Concurso, memoriais e planilhas e sem quaisquer indicações de autoria e responsabilidade técnica, para apreciação da Comissão Julgadora.'

    const espacoDisponivel = MAX_TOTAL - tamanhoTotalGeral
    const dentroDoprazo = new Date() <= DATA_LIMITE

    const form = useForm<UploadForm>({
        resolver: zodResolver(uploadSchema),
        defaultValues: { arquivos: [] }
    })

    const onSubmit = (data: UploadForm) => {
        startTransition(async () => {
            const erros: string[] = []

            for (const file of data.arquivos) {
                try {
                    const formData = new FormData()
                    formData.append('documentos', file)
                    formData.append('identificado', String(identificado))
                    formData.append('cadastroId', cadastro.id?.toString() || '')

                    const response = await fetch(`/api/cadastro/${cadastro.id}/projetos2`, {
                        method: 'POST',
                        body: formData
                    })

                    if (!response.ok) {
                        const { error } = await response.json() || { error: 'Erro desconhecido' }
                        erros.push(`${file.name}: ${error}`)
                    }
                } catch (error) {
                    console.error('Erro ao enviar arquivo:', error)
                    erros.push(`${file.name}: Erro ao enviar`)
                }
            }

            if (erros.length === 0) {
                toast.success('Arquivos enviados com sucesso!')
            } else if (erros.length < data.arquivos.length) {
                toast.warning(`${data.arquivos.length - erros.length} arquivo(s) enviado(s), ${erros.length} com erro.`)
            } else {
                toast.error('Erro ao enviar arquivos. Tente novamente.')
            }

            form.reset()
            dragDropRef.current?.reset()
            await onSuccess()
        })
    }

    const deletarArquivo = async (arquivoId: string) => {
        setDeletingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/projetos2/${arquivoId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                toast.success('Arquivo removido com sucesso!')
                await onSuccess()
            } else {
                toast.error('Erro ao remover arquivo. Tente novamente.')
            }
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error)
            toast.error('Erro ao remover arquivo. Tente novamente.')
        } finally {
            setDeletingFileId(null)
        }
    }

    const downloadArquivo = async (arquivoId: string, nomeArquivo: string) => {
        setDownloadingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/projetos2/${arquivoId}`)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
                throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
            }

            const contentType = response.headers.get('content-type')
            if (contentType?.includes('application/json')) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Resposta inesperada do servidor')
            }

            const blob = await response.blob()
            if (blob.size === 0) throw new Error('Arquivo vazio ou corrompido')

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = nomeArquivo
            document.body.appendChild(a)
            a.click()
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
        const tamanhoNovos = files.reduce((total, file) => total + file.size, 0)
        if (tamanhoTotalGeral + tamanhoNovos > MAX_TOTAL) {
            toast.error(`O tamanho total não pode exceder ${formatFileSize(MAX_TOTAL)}`)
            return
        }
        form.setValue('arquivos', files)
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    {titulo}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">{descricao}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
                {arquivosExistentes.length > 0 ? (
                    <div className="space-y-3">
                        {arquivosExistentes.map((arquivo) => (
                            <div key={arquivo.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <FolderOpen className="h-5 w-5 text-gray-500 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-medium break-all md:break-words md:max-w-sm">
                                            {arquivo.caminho?.split('/').pop()?.replace(/^(EMAIL-)?(IDENTIFICADO-|NAO_IDENTIFICADO-)(\d+-)/, '') || 'Arquivo'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {formatFileSize(arquivo.tamanho || 0)} • Enviado em{' '}
                                            {arquivo.criadoEm ? new Date(arquivo.criadoEm).toLocaleDateString('pt-BR') : '---'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={downloadingFileId === arquivo.id}
                                        onClick={() => {
                                            const nomeArquivo = arquivo.caminho?.split('/').pop() || 'arquivo'
                                            downloadArquivo(arquivo.id!, nomeArquivo)
                                        }}
                                    >
                                        {downloadingFileId === arquivo.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="h-4 w-4" />
                                        )}
                                    </Button>
                                    {dentroDoprazo && <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={deletingFileId === arquivo.id}
                                        onClick={() => deletarArquivo(arquivo.id!)}
                                    >
                                        {deletingFileId === arquivo.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>}
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-blue-700">
                                <AlertCircle className="h-4 w-4" />
                                <span>
                                    Total geral utilizado: {formatFileSize(tamanhoTotalGeral)} de {formatFileSize(MAX_TOTAL)}
                                    {espacoDisponivel > 0 && ` • ${formatFileSize(espacoDisponivel)} disponível`}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        <FolderOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                        <p>Nenhum arquivo enviado</p>
                        <p className="text-sm">Utilize o formulário abaixo para enviar arquivos</p>
                    </div>
                )}
            </CardContent>

            {dentroDoprazo && espacoDisponivel > 0 && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader className="px-4 sm:px-6 gap-2">
                            <Separator />
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Enviar arquivos {identificado ? 'identificados' : 'não identificados'}
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Limite máximo total (identificados + não identificados): {formatFileSize(MAX_TOTAL)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 space-y-4">
                            {espacoDisponivel < MAX_TOTAL * 0.1 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Pouco espaço disponível ({formatFileSize(espacoDisponivel)}).
                                        Considere remover alguns arquivos antes de enviar novos.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <FormField
                                control={form.control}
                                name="arquivos"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Arquivos</FormLabel>
                                        <FormControl>
                                            <DragDropInput
                                                ref={dragDropRef}
                                                accept=".pdf"
                                                multiple={true}
                                                maxSize={espacoDisponivel}
                                                buttonText="Selecionar arquivos"
                                                dropzoneText="Arraste e solte seus arquivos aqui"
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
                        <CardFooter className="px-4 sm:px-6 mt-2 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isPending || !form.watch('arquivos')?.length}
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
                                        Enviar
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            )}

            {dentroDoprazo && espacoDisponivel <= 0 && (
                <CardContent className="px-4 sm:px-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Limite de {formatFileSize(MAX_TOTAL)} atingido.
                            Remova alguns arquivos para enviar novos.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            )}
        </Card>
    )
}

export default function Projetos2Form({ cadastro, atualizarPagina }: Projetos2FormProps) {
    const projetos2 = cadastro.arquivos?.filter(a => a.tipo === TipoArquivo.PROJETOS_2) || []
    const identificados = projetos2.filter(a => isIdentificado(a.caminho || ''))
    const naoIdentificados = projetos2.filter(a => !isIdentificado(a.caminho || ''))
    const tamanhoTotalGeral = projetos2.reduce((total, a) => total + (a.tamanho || 0), 0)

    const refresh = () => atualizarPagina('projetos_fase2')

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        Fase 2
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Projetos em nível básico
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    Nos termos do item 17 do Edital, os Projetos em Nível Básico deverão ser apresentados conforme item 6 "NORMAS DE APRESENTAÇÃO DAS PROPOSTAS" do Termo de referência, em especial subitem 6.3 - "FASE 2: Projetos em Nível Básico", até o dia 20/03/2026, sendo necessária a apresentação de duas versões, em formato PDF, totalizando, no máximo, 600Mb.
                </CardContent>
            </Card>
            <UploadArea
                cadastro={cadastro}
                identificado={false}
                arquivosExistentes={naoIdentificados}
                tamanhoTotalGeral={tamanhoTotalGeral}
                onSuccess={refresh}
            />
            <UploadArea
                cadastro={cadastro}
                identificado={true}
                arquivosExistentes={identificados}
                tamanhoTotalGeral={tamanhoTotalGeral}
                onSuccess={refresh}
            />
        </div>
    )
}
