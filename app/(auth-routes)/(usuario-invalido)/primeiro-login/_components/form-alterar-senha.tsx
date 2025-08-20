"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmarSenha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
}).refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
});

export default function FormAlterarSenha({ usuario }: { usuario: User }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            senha: "",
            confirmarSenha: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { senha, confirmarSenha } = values;
            const response = await fetch(`/api/usuario/${usuario.id}/alterar-senha`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ senha, confirmarSenha }),
            });

            if (response.ok) {
                toast.success("Senha alterada com sucesso");
                await signOut();
            } else {
                toast.error("Erro ao alterar senha");
            }
        } catch (error) {
            console.error("Erro:", error);
            toast.error("Erro ao alterar senha");
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Alterar Senha</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Defina uma nova senha para sua conta.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 sm:space-y-6">
                    <CardContent className="px-4 sm:px-6">
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="senha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Nova Senha</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="Digite sua nova senha"
                                                className="h-10 sm:h-11"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmarSenha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Confirmar Nova Senha</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="Confirme sua nova senha"
                                                className="h-10 sm:h-11"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="px-4 sm:px-6 pt-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                            <Button 
                                type="submit" 
                                className="w-full sm:w-auto"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Alterando...
                                    </>
                                ) : (
                                    "Alterar Senha"
                                )}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}