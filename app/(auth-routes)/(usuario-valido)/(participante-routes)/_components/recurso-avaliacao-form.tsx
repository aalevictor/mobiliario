"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ICadastro } from "../../cadastros/page"
import { useState, useTransition, useRef } from "react"
import { FileText, Download, Trash2, Upload, AlertCircle, Loader2 } from "lucide-react"
import DragDropInput, { DragDropInputRef } from "@/components/drag-drop-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TipoArquivo } from "@prisma/client"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

interface RecursoAvaliacaoFormProps {
    cadastro: ICadastro
    atualizarPagina: (tab: string) => Promise<void>
}

const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB em bytes

const uploadSchema = z.object({
    documentos: z.array(z.instanceof(File)).min(1, "Selecione um documento").max(1, "Envie apenas um documento")
})

type UploadForm = z.infer<typeof uploadSchema>

export default function RecursoAvaliacaoForm({ cadastro, atualizarPagina }: RecursoAvaliacaoFormProps) {
    const [isPending, startTransition] = useTransition()
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
    const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
    const dragDropRef = useRef<DragDropInputRef>(null)

    // Documentos de recurso de avaliação
    const documentos = cadastro.arquivos?.filter(arquivo =>
        arquivo.tipo === TipoArquivo.DOC_ESPECIFICA &&
        (arquivo.caminho?.includes("RECURSO-AVALIACAO-"))
    ) || []

    // Janela para recurso de avaliação
    const dataAberturaRecursoAvaliacao = new Date("2025-12-01 00:00:00")
    const dataLimiteRecursoAvaliacao = new Date("2025-12-04 23:59:59.999")
    const dataAtual = new Date()
    const eAprovado = !!cadastro.avaliacao_licitadora?.aprovado
    const podeEnviarRecursoAvaliacao = eAprovado && dataAtual >= dataAberturaRecursoAvaliacao && dataAtual <= dataLimiteRecursoAvaliacao

    // Calcular tamanho total dos documentos existentes
    const tamanhoTotalExistente = documentos.reduce((total, doc) => {
        return total + (doc.tamanho || 0)
    }, 0)

    const espacoDisponivel = MAX_TOTAL_SIZE - tamanhoTotalExistente

    const form = useForm<UploadForm>({
        resolver: zodResolver(uploadSchema),
        defaultValues: { documentos: [] }
    })

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B'
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
        else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
    }

    const onSubmit = (data: UploadForm) => {
        if (!podeEnviarRecursoAvaliacao) {
            toast.error("Não é possível enviar documentos fora do período de recurso de avaliação ou sem aprovação.")
            return
        }
        startTransition(async () => {
            try {
                const formData = new FormData()
                data.documentos.forEach((file) => formData.append('documentos', file))
                formData.append('tipo', TipoArquivo.DOC_ESPECIFICA)
                formData.append('cadastroId', cadastro.id?.toString() || '')

                const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos`, { method: 'POST', body: formData })
                const payload = await response.json().catch(() => ({}))
                if (response.ok) {
                    toast.success('Documento de recurso de avaliação enviado com sucesso!')
                    form.reset()
                    dragDropRef.current?.reset()
                    await atualizarPagina('documentacao')
                } else {
                    toast.error(payload?.error || 'Erro ao enviar documento. Tente novamente.')
                }
            } catch (error) {
                console.error('Erro ao enviar documento:', error)
                toast.error('Erro ao enviar documento. Tente novamente.')
            }
        })
    }

    const deletarDocumento = async (arquivoId: string) => {
        setDeletingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos/${arquivoId}`, { method: 'DELETE' })
            const payload = await response.json().catch(() => ({}))
            if (response.ok) {
                toast.success('Documento removido com sucesso!')
                await atualizarPagina('documentacao')
            } else {
                toast.error(payload?.error || 'Erro ao remover documento. Tente novamente.')
            }
        } catch (error) {
            console.error('Erro ao deletar documento:', error)
            toast.error('Erro ao remover documento. Tente novamente.')
        } finally {
            setDeletingFileId(null)
        }
    }

    const downloadDocumento = async (arquivoId: string, nomeArquivo: string) => {
        setDownloadingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos/${arquivoId}`)
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
        const tamanhoNovosArquivos = files.reduce((total, file) => total + file.size, 0)
        if (tamanhoTotalExistente + tamanhoNovosArquivos > MAX_TOTAL_SIZE) {
            toast.error(`O tamanho total não pode exceder ${formatFileSize(MAX_TOTAL_SIZE)}`)
            return
        }
        form.setValue('documentos', files.slice(0, 1))
    }

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documento de Recurso de Avaliação
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Envio e gerenciamento do documento de recurso de avaliação.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    {documentos.length > 0 ? (
                        <div className="space-y-3">
                            {documentos.map((documento) => (
                                <div key={documento.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium break-all">{documento.caminho?.split('/').pop() || 'Documento'}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatFileSize(documento.tamanho || 0)} • Enviado em {documento.criadoEm ? new Date(documento.criadoEm).toLocaleDateString('pt-BR') : '---'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={downloadingFileId === documento.id}
                                            onClick={() => {
                                                const nomeArquivo = documento.caminho?.split('/').pop() || 'documento'
                                                downloadDocumento(documento.id!, nomeArquivo)
                                            }}
                                        >
                                            {downloadingFileId === documento.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={deletingFileId === documento.id || !podeEnviarRecursoAvaliacao}
                                            onClick={() => deletarDocumento(documento.id!)}
                                        >
                                            {deletingFileId === documento.id ? (
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
                            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum documento enviado</p>
                            {podeEnviarRecursoAvaliacao && <p className="text-sm">Utilize o formulário abaixo para enviar o documento de recurso de avaliação</p>}
                        </div>
                    )}
                </CardContent>
                {espacoDisponivel > 0 && podeEnviarRecursoAvaliacao && documentos.length === 0 && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardHeader className="px-4 sm:px-6 gap-4">
                                <Separator />
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <Upload className="h-5 w-5" />
                                    Enviar Documento de Recurso de Avaliação
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    <p>Envie aqui o documento único de recurso de avaliação (PDF).</p>
                                    <p className="text-xs">Limite máximo total: {formatFileSize(MAX_TOTAL_SIZE)}</p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="documentos"
                                    render={({ field }) => (
                                        <FormItem className="w-full mt-4">
                                            <FormLabel>Documento de Recurso de Avaliação</FormLabel>
                                            <FormControl>
                                                <DragDropInput
                                                    ref={dragDropRef}
                                                    accept=".pdf"
                                                    multiple={false}
                                                    maxSize={espacoDisponivel}
                                                    buttonText="Selecionar documento"
                                                    dropzoneText="Arraste e solte seu documento aqui"
                                                    helperText="Formato aceito: PDF"
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
                                <Button type="submit" disabled={isPending || !form.watch('documentos')?.length} className="w-full sm:w-auto">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Enviar Documento
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
                        Limite de {formatFileSize(MAX_TOTAL_SIZE)} atingido. Remova o documento para reenviar.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}