"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { formatarTelefone } from "@/lib/utils"
import { toast } from "sonner"
import { ICadastro } from "../../cadastros/page"

interface ResponsavelFormProps {
    cadastro: ICadastro
    atualizarPagina: (tab: string) => Promise<void>
}

const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.email("E-mail inválido"),
    telefone: z.string().min(14, "Telefone inválido"),
    cpf: z.string().min(14, "CPF é obrigatório"),
    cnpj: z.string().optional(),
})

export default function ResponsavelForm({ cadastro, atualizarPagina }: ResponsavelFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: cadastro.nome,
            email: cadastro.email,
            telefone: cadastro.telefone,
            cpf: cadastro.cpf,
            cnpj: cadastro.cnpj,
        },
    })
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (data.cnpj && data.cnpj.length > 0 && data.cnpj.length < 18) {
            toast.error("CNPJ inválido")
            return
        }
        const atualizarCadastro = await fetch(`/api/cadastro/${cadastro.id}`, {
            method: "PUT",
            body: JSON.stringify({
                telefone: data.telefone,
                cnpj: data.cnpj,
            }),
        })
        if (atualizarCadastro.ok) {
            toast.success("Cadastro atualizado com sucesso")
            await atualizarPagina("responsavel")
        }
    }
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Responsável</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Confira os dados do responsável do seu cadastro.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 sm:space-y-6">
                    <CardContent className="px-4 sm:px-6 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField control={form.control} name="nome" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm sm:text-base">Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled
                                            placeholder="Digite o nome completo"
                                            className="h-10 sm:h-11 disabled:opacity-100"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm sm:text-base">E-mail</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="email"
                                            disabled
                                            placeholder="seuemail@exemplo.com"
                                            className="h-10 sm:h-11 disabled:opacity-100"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="telefone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm sm:text-base">Telefone</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder="(11) 99999-9999"
                                            className="h-10 sm:h-11"
                                            onChange={(e) => {
                                                const telefone = formatarTelefone(e.target.value)
                                                field.onChange(telefone)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cpf" render={({ field }) => (
                                <FormItem className="md:col-span-1">
                                    <FormLabel className="text-sm sm:text-base">CPF</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled
                                            placeholder="000.000.000-00"
                                            className="h-10 sm:h-11 disabled:opacity-100"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cnpj" render={({ field }) => (
                                <FormItem className="md:col-span-1">
                                    <FormLabel className="text-sm sm:text-base">CNPJ</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="00.000.000/0000-00"
                                            className="h-10 sm:h-11 disabled:opacity-100"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        {/* Debug: Mostrar erros visualmente */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <h4 className="font-bold text-sm mb-2">Debug - Estado do Formulário:</h4>
                                <p className="text-xs">
                                    <strong>Válido:</strong> {form.formState.isValid ? 'Sim' : 'Não'}
                                </p>
                                <p className="text-xs">
                                    <strong>Erros:</strong> {JSON.stringify(form.formState.errors, null, 2)}
                                </p>
                                <p className="text-xs">
                                    <strong>Valores:</strong> {JSON.stringify(form.getValues(), null, 2)}
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="px-4 sm:px-6 pt-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                            <Button 
                                type="submit" 
                                className="w-full sm:w-auto"
                                disabled={!form.formState.isValid || form.formState.isSubmitting}
                            >
                                Salvar Alterações
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}