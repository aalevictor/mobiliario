"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Participante } from "@prisma/client"
import { ICadastro } from "../../cadastros/page"
import { useState } from "react"
import { Trash2, Plus, User } from "lucide-react"
import { toast } from "sonner"
import { formatarCPF } from "@/lib/utils"

interface ParticipantesFormProps {
    cadastro: ICadastro
    atualizarPagina: (tab: string) => Promise<void>
}

const novoParticipanteSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    documento: z.string().min(11, "CPF é obrigatório"),
})

type NovoParticipante = z.infer<typeof novoParticipanteSchema>

export default function ParticipantesForm({ cadastro, atualizarPagina }: ParticipantesFormProps) {
    const [participantesExistentes, setParticipantesExistentes] = useState<Partial<Participante>[]>(
        cadastro.participantes || []
    )

    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    const form = useForm<NovoParticipante>({
        resolver: zodResolver(novoParticipanteSchema),
        defaultValues: {
            nome: "",
            documento: "",
        },
    })

    const adicionarParticipante = async (data: NovoParticipante) => {
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/participante`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            if (response.ok) {
                const novoParticipante = await response.json()
                setParticipantesExistentes(prev => [...prev, novoParticipante])
                form.reset()
                setMostrarFormulario(false)
                toast.success("Participante adicionado com sucesso")
                await atualizarPagina("participantes")
            } else {
                toast.error("Erro ao adicionar participante")
            }
        } catch (error) {
            console.error("Erro:", error)
            toast.error("Erro ao adicionar participante")
        }
    }

    const removerParticipante = async (participanteId: number) => {
        try {
            const response = await fetch(`/api/cadastro/${cadastro.id}/participante/${participanteId}`, {
                method: "DELETE",
            })
            if (response.ok) {
                setParticipantesExistentes(prev => 
                    prev.filter(p => p.id !== participanteId)
                )
                toast.success("Participante removido com sucesso")
                await atualizarPagina("participantes")
            } else {
                toast.error("Erro ao remover participante")
            }
        } catch (error) {
            console.error("Erro:", error)
            toast.error("Erro ao remover participante")
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Participantes</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Gerencie os participantes do seu cadastro. Você pode adicionar novos participantes ou remover os existentes.
                </CardDescription>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 space-y-6">
                {/* Lista de Participantes Existentes */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <h3 className="text-lg font-medium">Participantes Cadastrados</h3>
                        <Button
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar Participante
                        </Button>
                    </div>
                    {participantesExistentes.length > 0 ? (
                        <div className="space-y-3">
                            {participantesExistentes.map((participante, index) => (
                                <div key={participante.id || index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">{participante.nome}</p>
                                            <p className="text-sm text-gray-600">CPF: {participante.documento}</p>
                                        </div>
                                    </div>
                                    {participantesExistentes.length > 1 && participante.id && (
                                        <Button
                                            onClick={() => removerParticipante(participante.id!)}
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-2 hover:opacity-60 transition-opacity cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <p className="hidden md:block">Remover</p>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum participante cadastrado</p>
                            <p className="text-sm">{`Clique em "Adicionar Participante" para começar`}</p>
                        </div>
                    )}
                </div>

                {/* Formulário para Adicionar Novo Participante */}
                {mostrarFormulario && (
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Adicionar Novo Participante</h3>
                        
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(adicionarParticipante)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="nome"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome Completo</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nome completo do participante"
                                                        className="h-10"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="documento"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CPF</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="000.000.000-00"
                                                        className="h-10"
                                                        onChange={(e) => {
                                                            const cpf = formatarCPF(e.target.value)
                                                            field.onChange(cpf)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {form.formState.isSubmitting ? "Adicionando..." : "Adicionar Participante"}
                                    </Button>
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setMostrarFormulario(false)
                                            form.reset()
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}