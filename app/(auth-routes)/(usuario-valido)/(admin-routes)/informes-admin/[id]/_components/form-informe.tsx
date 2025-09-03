"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTransition } from "react"
import { Informe } from "../../page"
import { Save, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap"

interface FormInformeProps {
    informe: Informe | null
}

const informeSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório").max(200, "Título deve ter no máximo 200 caracteres"),
    subtitulo: z.string(),
    conteudo: z.string().min(1, "Conteúdo é obrigatório"),
    publicado: z.boolean(),
    dataPublicacao: z.string().min(1, "Data de publicação é obrigatória"),
})

type InformeForm = z.infer<typeof informeSchema>

export default function FormInforme({ informe }: FormInformeProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    
    // Função para formatar data para datetime-local
    const formatDateForInput = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const form = useForm<InformeForm>({
        resolver: zodResolver(informeSchema),
        defaultValues: {
            titulo: informe?.titulo || "",
            subtitulo: informe?.subtitulo || "",
            conteudo: informe?.conteudo || "",
            publicado: informe?.publicado ?? false,
            dataPublicacao: informe?.dataPublicacao 
                ? formatDateForInput(new Date(informe.dataPublicacao))
                : formatDateForInput(new Date()),
        }
    })

    const onSubmit = (data: InformeForm) => {
        startTransition(async () => {
            try {
                const url = informe 
                    ? `/api/informes/${informe.id}` 
                    : '/api/informes'
                
                console.log(data)
                
                const method = informe ? 'PUT' : 'POST'
                
                // Converter string de data para ISO string
                const dataToSend = {
                    ...data,
                    dataPublicacao: new Date(data.dataPublicacao).toISOString()
                }
                
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                })

                if (!response.ok) {
                    throw new Error('Erro ao salvar informe')
                }

                const dataPublicacao = new Date(data.dataPublicacao);
                const agora = new Date();
                const isAgendado = dataPublicacao > agora;

                if (isAgendado && data.publicado) {
                    toast.success(informe ? 'Informe atualizado e agendado para publicação!' : 'Informe criado e agendado para publicação!')
                } else {
                    toast.success(informe ? 'Informe atualizado com sucesso!' : 'Informe criado com sucesso!')
                }
                
                router.push('/informes-admin')
                router.refresh()
            } catch (error) {
                console.error('Erro ao salvar informe:', error)
                toast.error('Erro ao salvar informe. Tente novamente.')
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">
                                Título *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Digite o título do informe"
                                    {...field}
                                    className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subtitulo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">
                                Subtítulo
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Digite o subtítulo (opcional)"
                                    {...field}
                                    className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dataPublicacao"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">
                                Data e Hora de Publicação *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="datetime-local"
                                    {...field}
                                    className="w-full"
                                    min={formatDateForInput(new Date())}
                                />
                            </FormControl>
                            <div className="text-xs text-gray-600">
                                O informe será publicado automaticamente nesta data e horário
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="conteudo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">
                                Conteúdo *
                            </FormLabel>
                            <FormControl>
                                <MinimalTiptapEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="w-full"
                                    editorContentClassName="p-5"
                                    output="html"
                                    placeholder="Digite o conteúdo do informe..."
                                    autofocus={true}
                                    editable={true}
                                    editorClassName="focus:outline-hidden"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="publicado"
                    render={({ field }) => {
                        const dataPublicacao = form.watch('dataPublicacao');
                        const isDataFutura = dataPublicacao && new Date(dataPublicacao) > new Date();
                        return (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Publicar informe
                                    </FormLabel>
                                    <div className="text-sm text-gray-600">
                                        {field.value ? (
                                            <span className="flex items-center gap-2 text-green-600">
                                                <Eye className="h-4 w-4" />
                                                {isDataFutura 
                                                    ? "Informe será publicado automaticamente na data selecionada"
                                                    : "Informe será visível para todos os usuários imediatamente"
                                                }
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-gray-500">
                                                <EyeOff className="h-4 w-4" />
                                                Informe ficará como rascunho
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />

                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {informe ? 'Atualizar' : 'Salvar'} Informe
                            </>
                        )}
                    </Button>
                    
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </Form>
    )
}