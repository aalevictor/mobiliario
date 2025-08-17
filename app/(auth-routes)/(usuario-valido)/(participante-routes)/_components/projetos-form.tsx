"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ICadastro } from "../../cadastros/page"

interface ProjetosFormProps {
    cadastro: ICadastro
    atualizarPagina: (tab: string) => Promise<void>
}

const formSchema = z.object({
    nome: z.string().min(1),
    email: z.email(),
    telefone: z.string().min(1),
    cpf: z.string().min(1),
})

export default function ProjetosForm({ cadastro, atualizarPagina }: ProjetosFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: cadastro.nome,
            email: cadastro.email,
            telefone: cadastro.telefone,
            cpf: cadastro.cpf,
        },
    })
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        await atualizarPagina("projetos")
    }
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Responsável</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Confira os dados do responsável do seu cadastro.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField control={form.control} name="nome" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm sm:text-base">Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder="Digite o nome completo"
                                            className="h-10 sm:h-11"
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
                                            placeholder="seuemail@exemplo.com"
                                            className="h-10 sm:h-11"
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cpf" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm sm:text-base">CPF</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="000.000.000-00"
                                            className="h-10 sm:h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="px-4 sm:px-6 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                    <Button 
                        type="submit" 
                        className="w-full sm:w-auto"
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}