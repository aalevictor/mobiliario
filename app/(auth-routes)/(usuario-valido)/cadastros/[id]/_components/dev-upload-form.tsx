"use client"

import { useRef, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"
import { Upload, Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DragDropInput, { DragDropInputRef } from "@/components/drag-drop-input"

const CATEGORIAS = [
    { value: "doc-especifica", label: "Documentação Específica" },
    { value: "habilitacao", label: "Documentação de Habilitação" },
    { value: "recurso", label: "Documentação de Recurso" },
    { value: "projetos", label: "Projetos Fase 1" },
    { value: "projetos2-identificado", label: "Projetos Fase 2 — Identificados" },
    { value: "projetos2-nao-identificado", label: "Projetos Fase 2 — Não Identificados" },
] as const

const schema = z.object({
    categoria: z.string().min(1, "Selecione uma categoria"),
    documentos: z.array(z.instanceof(File)).min(1, "Selecione pelo menos um arquivo"),
})

type FormData = z.infer<typeof schema>

interface DevUploadFormProps {
    cadastroId: number
    onSuccess?: () => void
}

export default function DevUploadForm({ cadastroId, onSuccess }: DevUploadFormProps) {
    const [isPending, startTransition] = useTransition()
    const dragDropRef = useRef<DragDropInputRef>(null)

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { categoria: "", documentos: [] },
    })

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append("categoria", data.categoria)
                data.documentos.forEach((file) => formData.append("documentos", file))

                const response = await fetch(`/api/cadastro/${cadastroId}/dev-upload`, {
                    method: "POST",
                    body: formData,
                })

                if (response.ok) {
                    toast.success("Arquivos enviados com sucesso!")
                    form.reset()
                    dragDropRef.current?.reset()
                    onSuccess?.()
                } else {
                    const body = await response.json().catch(() => ({}))
                    toast.error(body.error || "Erro ao enviar arquivos. Tente novamente.")
                }
            } catch (error) {
                console.error("Erro ao enviar arquivos DEV:", error)
                toast.error("Erro ao enviar arquivos. Tente novamente.")
            }
        })
    }

    return (
        <Card className="border-amber-300 bg-amber-50">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                            <ShieldAlert className="h-5 w-5" />
                            Upload DEV
                        </CardTitle>
                        <CardDescription>
                            Envie arquivos em nome do participante sem restrição de período
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="categoria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria do arquivo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {CATEGORIAS.map((c) => (
                                                <SelectItem key={c.value} value={c.value}>
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="documentos"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Arquivos</FormLabel>
                                    <FormControl>
                                        <DragDropInput
                                            ref={dragDropRef}
                                            accept="*"
                                            multiple={true}
                                            buttonText="Selecionar arquivos"
                                            dropzoneText="Arraste e solte os arquivos aqui"
                                            helperText="Todos os formatos aceitos (PDF, ZIP, DWG, etc.)"
                                            onChange={(files) => field.onChange(files)}
                                            disabled={isPending}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isPending || !form.watch("documentos")?.length || !form.watch("categoria")}
                            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Enviar Arquivos
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
