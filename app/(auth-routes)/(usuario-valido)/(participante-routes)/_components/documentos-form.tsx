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

interface DocumentosFormProps {
    cadastro: ICadastro  
    atualizarPagina: (tab: string) => Promise<void>
}

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB em bytes

const uploadSchema = z.object({
    documentos: z.array(z.instanceof(File)).min(1, "Selecione pelo menos um documento")
})

type UploadForm = z.infer<typeof uploadSchema>

export default function DocumentosForm({ cadastro, atualizarPagina }: DocumentosFormProps) {
    const [isPending, startTransition] = useTransition()
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
    const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
    const dragDropRef = useRef<DragDropInputRef>(null)
    
    // Filtrar apenas documentos específicos
    const documentos = cadastro.arquivos?.filter(arquivo => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA) || []
    
    // Calcular tamanho total dos documentos existentes
    const tamanhoTotalExistente = documentos.reduce((total, doc) => {
        return total + (doc.tamanho || 0)
    }, 0)
    
    const espacoDisponivel = MAX_TOTAL_SIZE - tamanhoTotalExistente
    
    const form = useForm<UploadForm>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            documentos: []
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
                data.documentos.forEach((file) => {
                    formData.append(`documentos`, file)
                })
                
                formData.append('tipo', TipoArquivo.DOC_ESPECIFICA)
                formData.append('cadastroId', cadastro.id?.toString() || '')
                
                const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos`, {
                    method: 'POST',
                    body: formData
                })
                
                if (response.ok) {
                    toast.success('Documentos enviados com sucesso!')
                    form.reset()
                    dragDropRef.current?.reset()
                    await atualizarPagina('documentos')
                } else {
                    toast.error('Erro ao enviar documentos. Tente novamente.')
                }
            } catch (error) {
                console.error('Erro ao enviar documentos:', error)
                toast.error('Erro ao enviar documentos. Tente novamente.')
            }
        })
    }
    
    const deletarDocumento = async (arquivoId: string) => {
        setDeletingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos/${arquivoId}`, {
                method: 'DELETE'
            })
            
            if (response.ok) {
                toast.success('Documento removido com sucesso!')
                await atualizarPagina('documentos')
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
    
    const downloadDocumento = async (arquivoId: string, nomeArquivo: string) => {
        setDownloadingFileId(arquivoId)
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/arquivos/${arquivoId}`)
            
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
        
        form.setValue('documentos', files)
    }

    return (
        <div className="space-y-6">
            {/* Lista de Documentos Existentes */}
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documentos Enviados
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Lista de documentos de habilitação já enviados.
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
                                            <p className="font-medium">{documento.caminho?.split('/').pop() || 'Documento'}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatFileSize(documento.tamanho || 0)} • Enviado em{' '}
                                                {documento.criadoEm ? new Date(documento.criadoEm).toLocaleDateString('pt-BR') : '---'}
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
                                            disabled={deletingFileId === documento.id}
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
                            <p className="text-sm">Utilize o formulário abaixo para enviar seus documentos</p>
                        </div>
                    )}
                </CardContent>
                {/* Formulário de Upload */}
                {espacoDisponivel > 0 && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardHeader className="px-4 sm:px-6 gap-4">
                                <Separator />
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    <Upload className="h-5 w-5" />
                                    Enviar Novos Documentos
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Envie novos documentos de habilitação. Limite máximo total: {formatFileSize(MAX_TOTAL_SIZE)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6 space-y-4">
                                {espacoDisponivel < MAX_TOTAL_SIZE * 0.1 && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Atenção: Pouco espaço disponível ({formatFileSize(espacoDisponivel)}). 
                                            Considere remover alguns documentos antes de enviar novos.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                <FormField
                                    control={form.control}
                                    name="documentos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Documentos de Habilitação</FormLabel>
                                            <FormControl>
                                                <DragDropInput
                                                    ref={dragDropRef}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    multiple={true}
                                                    maxSize={espacoDisponivel}
                                                    buttonText="Selecionar documentos"
                                                    dropzoneText="Arraste e solte seus documentos aqui"
                                                    helperText="Formatos aceitos: PDF, DOC, DOCX, JPG, PNG"
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
                                    disabled={isPending || !form.watch('documentos')?.length}
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
                                            Enviar Documentos
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
                        Remova alguns documentos para enviar novos arquivos.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}