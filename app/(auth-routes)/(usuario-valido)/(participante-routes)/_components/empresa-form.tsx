"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ViaCepResposta } from "@/types/cep"
import { formatarCEP, formatarCNPJ } from "@/lib/utils"
import { toast } from "sonner"
import { ICadastro } from "../../cadastros/page"

interface EmpresaFormProps {
    cadastro: ICadastro
    atualizarPagina: (tab: string) => Promise<void>
}

const formSchema = z.object({
    cnpj: z.string().min(18, "CNPJ é obrigatório"),
    cep: z.string().min(9, "CEP é obrigatório"),
    logradouro: z.string().min(1, "Logradouro é obrigatório"),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    uf: z.string().min(1, "UF é obrigatório"),
})

export default function EmpresaForm({ cadastro, atualizarPagina }: EmpresaFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cnpj: cadastro.cnpj,
            cep: cadastro.cep,
            logradouro: cadastro.logradouro,
            numero: cadastro.numero || undefined,
            complemento: cadastro.complemento || undefined,
            cidade: cadastro.cidade,
            uf: cadastro.uf,
        },
    })
    
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const atualizarCadastro = await fetch(`/api/cadastro/${cadastro.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        })
        if (atualizarCadastro.ok) {
            toast.success("Cadastro atualizado com sucesso")
            await atualizarPagina("empresa")
        }
    }

    async function buscaCEP(cep: string) {
        cep = cep.replace(/\D/g, "").trim().substring(0, 8);
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data: ViaCepResposta = await response.json();
                form.setValue("logradouro", data.logradouro || "")
                form.setValue("cidade", data.localidade || "")
                form.setValue("uf", data.uf || "")
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    }

    function limpaEndereco() {
        form.setValue("logradouro", "")
        form.setValue("cidade", "")
        form.setValue("uf", "")
        form.setValue("numero", "")
        form.setValue("complemento", "")
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="text-lg sm:text-xl">Empresa</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Confira os dados da empresa do seu cadastro.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 sm:space-y-6">
                    <CardContent className="px-4 sm:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                            <FormField control={form.control} name="cnpj" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm sm:text-base">CNPJ</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder="00.000.000/0000-00"
                                            className="h-10 sm:h-11"
                                            onChange={(e) => {
                                                const cnpj = formatarCNPJ(e.target.value)
                                                field.onChange(cnpj)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cep" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm sm:text-base">CEP</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="text"
                                            placeholder="00000-000"
                                            className="h-10 sm:h-11"
                                            onChange={(e) => {
                                                const cep = formatarCEP(e.target.value)
                                                field.onChange(cep)
                                                limpaEndereco()
                                                if (cep.length === 9) buscaCEP(cep)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="logradouro" render={({ field }) => (
                                <FormItem className="md:col-span-3">
                                    <FormLabel className="text-sm sm:text-base">Logradouro</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled
                                            className="h-10 sm:h-11 disabled:opacity-100"
                                            placeholder="Rua, Avenida, etc."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="numero" render={({ field }) => (
                                <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Número</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="00"
                                            className="h-10 sm:h-11"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="complemento" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-sm sm:text-base">Complemento</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Apto, Bloco, etc." className="h-10 sm:h-11" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="cidade" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm sm:text-base">Cidade</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="São Paulo" disabled className="h-10 sm:h-11 disabled:opacity-100" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="uf" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm sm:text-base">UF</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="SP" disabled className="h-10 sm:h-11 disabled:opacity-100" />
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
                                disabled={form.formState.isSubmitting}
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


