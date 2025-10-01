"use client"

import DragDropInput, { DragDropInputRef } from "@/components/drag-drop-input"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Upload, Loader2 } from "lucide-react"
import z from "zod"
import { useRef, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { TipoArquivo } from "@prisma/client"
import { ICadastroBusca } from "@/services/cadastros"
import { useRouter } from "next/navigation"

const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 50MB em bytes

const uploadSchema = z.object({
    documentos: z.array(z.instanceof(File)).min(1, "Selecione pelo menos um documento")
})

type UploadForm = z.infer<typeof uploadSchema>
export default function FormArquivos({ tipo, cadastro, onSuccess }: { 
    tipo: 'documento' | 'recurso', 
    cadastro: ICadastroBusca,
    onSuccess?: () => void 
}) {
    const [isPending, startTransition] = useTransition()
    const dragDropRef = useRef<DragDropInputRef>(null)
    const router = useRouter()
    
    // Filtrar apenas documentos específicos
    let documentos = cadastro.arquivos || [];
    if (tipo === "documento") documentos = documentos.filter(arquivo => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && !arquivo.caminho?.split("/").pop()?.startsWith("RECURSO-"))
    if (tipo === "recurso") documentos = documentos.filter(arquivo => arquivo.tipo === TipoArquivo.DOC_ESPECIFICA && arquivo.caminho?.split("/").pop()?.startsWith("RECURSO-"))
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

    const rotas = {
        documento: 'arquivos',
        recurso: 'recursos'
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
                
                const response = await fetch(`/api/cadastro/${cadastro.id}/${rotas[tipo]}`, {
                    method: 'POST',
                    body: formData
                })
                
                if (response.ok) {
                    toast.success('Documentos enviados com sucesso!')
                    form.reset()
                    dragDropRef.current?.reset()
                    
                    // Atualizar os dados da página
                    if (onSuccess) {
                        onSuccess()
                    } else {
                        router.refresh()
                    }
                    
                } else {
                    toast.error('Erro ao enviar documentos. Tente novamente.')
                }
            } catch (error) {
                console.error('Erro ao enviar documentos:', error)
                toast.error('Erro ao enviar documentos. Tente novamente.')
            }
        })
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

    return espacoDisponivel > 0 && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader className="px-4 sm:px-6 gap-4">
                    <Separator />
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Enviar Novos {tipo === "documento" ? "Documentos" : "Documentos de Recurso"}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        <p>Envie aqui os documentos enviados por email.</p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 space-y-4">
                    <FormField
                        control={form.control}
                        name="documentos"
                        render={({ field }) => (
                            <FormItem className="w-full mt-4">
                                <FormLabel>Documentos de {tipo === "documento" ? "Habilitação" : "Recurso"}</FormLabel>
                                <FormControl>
                                    <DragDropInput
                                        ref={dragDropRef}
                                        accept=".pdf"
                                        multiple={true}
                                        maxSize={espacoDisponivel}
                                        buttonText="Selecionar documentos"
                                        dropzoneText="Arraste e solte os documentos aqui"
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
    )
}